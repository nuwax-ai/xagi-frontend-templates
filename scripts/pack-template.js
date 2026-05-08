#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

/**
 * 模板打包脚本
 * 用于将指定的模板项目打包成 zip 文件，排除 .gitignore 中指定的文件
 */

// 获取命令行参数
const templateName = process.argv[2]
const isRelease = process.argv.includes('--release')

if (!templateName) {
  console.error('❌ 请指定模板名称')
  console.log('用法: node scripts/pack-template.js <template-name> [--release]')
  console.log('可用模板: react-vite, react-next, vue3-vite')
  console.log('  --release  生成稳定文件名（无时间戳），用于 GitHub Release')
  process.exit(1)
}

// 模板配置
const templates = {
  'react-vite': {
    name: 'React + Vite + TypeScript',
    dir: 'packages/react-vite',
    outputName: 'react-vite-template',
  },
  'react-next': {
    name: 'React + Next.js + TypeScript',
    dir: 'packages/react-next',
    outputName: 'react-next-template',
  },
  'vue3-vite': {
    name: 'Vue 3 + Vite + TypeScript',
    dir: 'packages/vue3-vite',
    outputName: 'vue3-vite-template',
  },
}

const template = templates[templateName]

if (!template) {
  console.error(`❌ 未找到模板: ${templateName}`)
  console.log('可用模板:', Object.keys(templates).join(', '))
  process.exit(1)
}

const templateDir = path.resolve(__dirname, '..', template.dir)
const outputDir = path.resolve(__dirname, '..', 'zip')

// 检查模板目录是否存在
if (!fs.existsSync(templateDir)) {
  console.error(`❌ 模板目录不存在: ${templateDir}`)
  process.exit(1)
}

// 创建输出目录
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// 读取 package.json 获取版本号
let version = null
const packageJsonPath = path.join(templateDir, 'package.json')
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    if (packageJson.version) {
      version = packageJson.version
    }
  } catch (error) {
    console.warn(`⚠️  读取 package.json 失败: ${error.message}`)
  }
}

// 生成时间戳：YYYY_MM_DD_HH_MM_SS
const now = new Date()
const year = now.getFullYear()
const month = String(now.getMonth() + 1).padStart(2, '0')
const day = String(now.getDate()).padStart(2, '0')
const hours = String(now.getHours()).padStart(2, '0')
const minutes = String(now.getMinutes()).padStart(2, '0')
const seconds = String(now.getSeconds()).padStart(2, '0')
const timestamp = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`

let fileName
if (isRelease) {
  if (!version) {
    console.error('❌ Release 模式需要 package.json 中有 version 字段')
    process.exit(1)
  }
  fileName = `${template.outputName}_${version}.zip`
} else {
  fileName = version
    ? `${template.outputName}_${version}_${timestamp}.zip`
    : `${template.outputName}_${timestamp}.zip`
}
const outputFile = path.join(outputDir, fileName)

// 清除之前的包（匹配该模板的所有旧文件）
console.log(`🧹 清除之前的包...`)
try {
  const files = fs.readdirSync(outputDir)
  // 匹配该模板的所有旧文件（可能包含版本号，也可能不包含）
  const oldFiles = files.filter(file => {
    const baseName = file.replace(/\.zip$/, '')
    // 匹配格式：templateName_* 或 templateName_version_*
    return (
      file.endsWith('.zip') &&
      (baseName === template.outputName ||
        baseName.startsWith(`${template.outputName}_`))
    )
  })

  if (oldFiles.length > 0) {
    oldFiles.forEach(file => {
      const filePath = path.join(outputDir, file)
      fs.unlinkSync(filePath)
      console.log(`  ✓ 已删除: ${file}`)
    })
    console.log(`✅ 已清除 ${oldFiles.length} 个旧文件\n`)
  } else {
    console.log(`  ℹ️  没有找到旧文件\n`)
  }
} catch (error) {
  console.warn(`⚠️  清除旧文件时出错: ${error.message}\n`)
}

console.log(`🚀 开始打包模板: ${template.name}`)
if (version) {
  console.log(`📌 版本号: ${version}`)
}
console.log(`📁 源目录: ${templateDir}`)
console.log(`📦 输出文件: ${outputFile}`)

try {
  // 读取 .gitignore 文件
  const gitignorePath = path.join(templateDir, '.gitignore')
  let ignorePatterns = []

  // 强制排除的目录和文件
  const forceExclude = [
    'node_modules',
    'dist',
    'dist-ssr',
    'build',
    '.next',
    '.nuxt',
    '.cache',
    '.parcel-cache',
    'coverage',
    '.nyc_output',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
    'playground',
  ]

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8')
    ignorePatterns = gitignoreContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(pattern => {
        // 处理 .gitignore 模式
        if (pattern.endsWith('/')) {
          return pattern.slice(0, -1) // 移除末尾的 /
        }
        return pattern
      })
  }

  // 合并强制排除和 .gitignore 中的模式
  ignorePatterns = [...new Set([...forceExclude, ...ignorePatterns])]

  // 构建 zip 命令 - 使用更可靠的排除方式
  let zipCommand = `cd "${templateDir}" && zip -r "${outputFile}" .`

  // 添加排除模式 - 使用多个 -x 参数，确保正确排除
  if (ignorePatterns.length > 0) {
    ignorePatterns.forEach(pattern => {
      zipCommand += ` -x "${pattern}/*" -x "${pattern}"`
    })
  }

  console.log('📋 排除模式:', ignorePatterns.length > 0 ? ignorePatterns.join(', ') : '无')

  // 执行打包命令
  console.log('⏳ 正在打包...')
  execSync(zipCommand, { stdio: 'inherit' })

  // 检查输出文件
  if (fs.existsSync(outputFile)) {
    const stats = fs.statSync(outputFile)
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2)

    console.log('✅ 打包完成!')
    console.log(`📦 输出文件: ${outputFile}`)
    console.log(`📊 文件大小: ${fileSizeInMB} MB`)
  } else {
    console.error('❌ 打包失败: 输出文件未生成')
    process.exit(1)
  }
} catch (error) {
  console.error('❌ 打包过程中发生错误:', error.message)
  process.exit(1)
}
