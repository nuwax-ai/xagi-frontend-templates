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
]

const templatesRegistry = readJson('templates.json')
let hasError = false

for (const spec of templateSpecs) {
  const pkg = readJson(spec.packagePath)
  const meta = readJson(spec.metaPath)
  const registryItem = templatesRegistry.templates.find(template => template.id === spec.id)

  if (!registryItem) {
    console.error(`[ERROR] templates.json missing entry for id: ${spec.id}`)
    hasError = true
    continue
  }

  const expectedVersion = pkg.version
  const actualVersions = {
    package: pkg.version,
    meta: meta.version,
    registry: registryItem.version,
  }

  const mismatches = Object.entries(actualVersions).filter(([, value]) => value !== expectedVersion)

  if (mismatches.length > 0) {
    hasError = true
    console.error(`\n[ERROR] Version mismatch for ${spec.id}`)
    console.error(`  expected (package.json): ${expectedVersion}`)
    console.error(`  actual meta.json: ${actualVersions.meta}`)
    console.error(`  actual templates.json: ${actualVersions.registry}`)
  } else {
    console.log(`[OK] ${spec.id} version aligned: ${expectedVersion} (package/meta/templates)`)
  }
}

if (hasError) {
  process.exit(1)
}

console.log('\nVersion consistency check passed.')
