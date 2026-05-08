#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const rootDir = path.resolve(__dirname, '..')

const REPO = 'nuwax-ai/xagi-frontend-templates'
const BASE_URL = `https://github.com/${REPO}/releases/download`

const templateSpecs = [
  { id: 'react-vite', outputName: 'react-vite-template', dir: 'packages/react-vite' },
  { id: 'vue3-vite', outputName: 'vue3-vite-template', dir: 'packages/vue3-vite' },
  { id: 'react-next', outputName: 'react-next-template', dir: 'packages/react-next' },
]

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'))
}

function computeSha256(filePath) {
  if (!fs.existsSync(filePath)) return null
  const data = fs.readFileSync(filePath)
  return crypto.createHash('sha256').update(data).digest('hex')
}

const version = process.argv[2]

if (!version) {
  const rootPkg = readJson('package.json')
  console.error(`Usage: node scripts/generate-latest-json.js <version>`)
  console.error(`  Current root version: ${rootPkg.version}`)
  process.exit(1)
}

const tag = `v${version}`
const zipDir = path.join(rootDir, 'zip')

const templates = {}

for (const spec of templateSpecs) {
  const pkg = readJson(`${spec.dir}/package.json`)
  const fileName = `${spec.outputName}_${pkg.version}.zip`
  const zipPath = path.join(zipDir, fileName)
  const sha256 = computeSha256(zipPath)

  templates[spec.id] = {
    version: pkg.version,
    url: `${BASE_URL}/${tag}/${fileName}`,
    ...(sha256 && { sha256 }),
  }
}

const latestJson = {
  version,
  tag,
  updatedAt: new Date().toISOString(),
  repository: `https://github.com/${REPO}`,
  downloadUrlPattern: `${BASE_URL}/{tag}/{template}_{version}.zip`,
  templates,
}

const outputPath = path.join(rootDir, 'latest.json')
fs.writeFileSync(outputPath, JSON.stringify(latestJson, null, 2) + '\n')

console.log(`✅ latest.json generated at ${outputPath}`)
console.log(`   version: ${version}`)
console.log(`   tag: ${tag}`)
for (const [id, info] of Object.entries(templates)) {
  console.log(`   ${id}: ${info.url}`)
  if (info.sha256) {
    console.log(`     sha256: ${info.sha256}`)
  } else {
    console.log(`     ⚠️  zip file not found, sha256 skipped`)
  }
}
