#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')

function readJson(relativePath) {
  const filePath = path.join(rootDir, relativePath)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

const templateSpecs = [
  {
    id: 'vue3-vite',
    packagePath: 'packages/vue3-vite/package.json',
    metaPath: 'packages/vue3-vite/meta.json',
  },
  {
    id: 'react-vite',
    packagePath: 'packages/react-vite/package.json',
    metaPath: 'packages/react-vite/meta.json',
  },
  {
    id: 'react-next',
    packagePath: 'packages/react-next/package.json',
    metaPath: 'packages/react-next/meta.json',
  },
]

const rootPkg = readJson('package.json')
const templatesRegistry = readJson('templates.json')
let hasError = false

// Check root package.json version vs templates.json root version
if (rootPkg.version !== templatesRegistry.version) {
  console.error(`\n[ERROR] Root version mismatch`)
  console.error(`  package.json:    ${rootPkg.version}`)
  console.error(`  templates.json:  ${templatesRegistry.version}`)
  hasError = true
} else {
  console.log(`[OK] Root version aligned: ${rootPkg.version}`)
}

// Check each template
for (const spec of templateSpecs) {
  const pkg = readJson(spec.packagePath)
  const meta = readJson(spec.metaPath)
  const registryItem = templatesRegistry.templates.find(template => template.id === spec.id)

  if (!registryItem) {
    console.error(`[ERROR] templates.json missing entry for id: ${spec.id}`)
    hasError = true
    continue
  }

  const expectedVersion = rootPkg.version
  const actualVersions = {
    'package.json': pkg.version,
    'meta.json': meta.version,
    'templates.json': registryItem.version,
  }

  const mismatches = Object.entries(actualVersions).filter(([, value]) => value !== expectedVersion)

  if (mismatches.length > 0) {
    hasError = true
    console.error(`\n[ERROR] Version mismatch for ${spec.id}`)
    console.error(`  expected (root):        ${expectedVersion}`)
    for (const [source, value] of mismatches) {
      console.error(`  actual ${source}: ${value}`)
    }
  } else {
    console.log(`[OK] ${spec.id} version aligned: ${expectedVersion} (package/meta/templates)`)
  }
}

if (hasError) {
  process.exit(1)
}

console.log('\n✅ Version consistency check passed.')
