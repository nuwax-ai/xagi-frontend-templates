#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const rootDir = path.resolve(__dirname, '..')

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relPath), 'utf8'))
}

function writeJson(relPath, data) {
  fs.writeFileSync(path.join(rootDir, relPath), JSON.stringify(data, null, 2) + '\n')
}

function run(cmd, options = {}) {
  execSync(cmd, { stdio: 'inherit', cwd: rootDir, ...options })
}

function runQuiet(cmd) {
  return execSync(cmd, { encoding: 'utf8', cwd: rootDir }).trim()
}

const SEMVER_RE = /^\d+\.\d+\.\d+$/

const args = process.argv.slice(2)
let newVersion = null

for (const arg of args) {
  if (arg === '--patch' || arg === '--minor' || arg === '--major') {
    const rootPkg = readJson('package.json')
    const parts = rootPkg.version.split('.').map(Number)
    if (arg === '--patch') { parts[2]++; }
    else if (arg === '--minor') { parts[1]++; parts[2] = 0; }
    else if (arg === '--major') { parts[0]++; parts[1] = 0; parts[2] = 0; }
    newVersion = parts.join('.')
  } else if (SEMVER_RE.test(arg)) {
    newVersion = arg
  }
}

if (!newVersion) {
  console.error('❌ 请指定版本号')
  console.log('')
  console.log('用法:')
  console.log('  pnpm release <version>       指定版本号，如 pnpm release 1.3.0')
  console.log('  pnpm release --patch         递增补丁版本 1.2.1 → 1.2.2')
  console.log('  pnpm release --minor         递增次版本   1.2.1 → 1.3.0')
  console.log('  pnpm release --major         递增主版本   1.2.1 → 2.0.0')
  process.exit(1)
}

const tag = `v${newVersion}`

console.log('==========================================')
console.log(`  XAGI Frontend Templates Release`)
console.log(`  Target version: ${newVersion}`)
console.log(`  Tag: ${tag}`)
console.log('==========================================')
console.log('')

// 1. Check working tree clean
try {
  const status = runQuiet('git status --porcelain')
  if (status) {
    console.error('❌ 工作区有未提交的变更，请先 commit 或 stash')
    console.log(status)
    process.exit(1)
  }
} catch {
  console.error('❌ 无法检查 git 状态')
  process.exit(1)
}

// 2. Check tag doesn't already exist
const existingTags = runQuiet('git tag -l').split('\n').filter(Boolean)
if (existingTags.includes(tag)) {
  console.error(`❌ Tag ${tag} 已存在`)
  process.exit(1)
}

// 3. Update all version numbers
console.log('📝 更新版本号...')
const templateSpecs = [
  { id: 'react-vite', packagePath: 'packages/react-vite/package.json', metaPath: 'packages/react-vite/meta.json' },
  { id: 'vue3-vite', packagePath: 'packages/vue3-vite/package.json', metaPath: 'packages/vue3-vite/meta.json' },
  { id: 'react-next', packagePath: 'packages/react-next/package.json', metaPath: 'packages/react-next/meta.json' },
]

// Update root package.json
const rootPkg = readJson('package.json')
rootPkg.version = newVersion
writeJson('package.json', rootPkg)
console.log(`  ✓ root package.json → ${newVersion}`)

// Update templates.json
const templatesRegistry = readJson('templates.json')
templatesRegistry.version = newVersion
templatesRegistry.updatedAt = new Date().toISOString()
for (const spec of templateSpecs) {
  const entry = templatesRegistry.templates.find(t => t.id === spec.id)
  if (entry) {
    entry.version = newVersion
    console.log(`  ✓ templates.json[${spec.id}] → ${newVersion}`)
  }
}
writeJson('templates.json', templatesRegistry)

// Update each template package.json and meta.json
for (const spec of templateSpecs) {
  const pkg = readJson(spec.packagePath)
  pkg.version = newVersion
  writeJson(spec.packagePath, pkg)
  console.log(`  ✓ ${spec.packagePath} → ${newVersion}`)

  const meta = readJson(spec.metaPath)
  meta.version = newVersion
  writeJson(spec.metaPath, meta)
  console.log(`  ✓ ${spec.metaPath} → ${newVersion}`)
}

console.log('')

// 4. Run version consistency check
console.log('🔍 校验版本一致性...')
try {
  run('node scripts/check-versions.js')
  console.log('✅ 版本一致性校验通过')
} catch {
  console.error('❌ 版本一致性校验失败')
  process.exit(1)
}
console.log('')

// 5. Git commit
console.log('📦 创建 release commit...')
try {
  run('git add package.json templates.json latest.json packages/*/package.json packages/*/meta.json')
  run(`git commit -m "release: ${tag}"`)
  console.log(`  ✓ Committed: release: ${tag}`)
} catch {
  console.error('❌ Git commit 失败')
  process.exit(1)
}
console.log('')

// 6. Git tag
console.log(`🏷️  创建 tag: ${tag}...`)
try {
  run(`git tag -a ${tag} -m "Release ${tag}"`)
  console.log(`  ✓ Tag created: ${tag}`)
} catch {
  console.error('❌ Git tag 创建失败')
  process.exit(1)
}
console.log('')

// 7. Push
console.log('🚀 推送到远程...')
try {
  run('git push')
  run(`git push origin ${tag}`)
  console.log('  ✓ Pushed commit and tag')
} catch {
  console.error('❌ Push 失败')
  console.log('')
  console.log('你可以手动执行:')
  console.log(`  git push`)
  console.log(`  git push origin ${tag}`)
  process.exit(1)
}

console.log('')
console.log('==========================================')
console.log('  ✅ Release 流程完成!')
console.log('==========================================')
console.log('')
console.log(`  版本: ${newVersion}`)
console.log(`  Tag:  ${tag}`)
console.log('')
console.log('  GitHub Actions 将自动:')
console.log('    1. 打包所有模板')
console.log('    2. 创建 GitHub Release')
console.log('    3. 上传 zip 文件')
console.log('    4. 更新 latest.json')
console.log('')
console.log('  下载地址:')
console.log(`    https://github.com/nuwax-ai/xagi-frontend-templates/releases/tag/${tag}`)
console.log(`    https://raw.githubusercontent.com/nuwax-ai/xagi-frontend-templates/main/latest.json`)
console.log('')
