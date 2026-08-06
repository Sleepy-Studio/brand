import { access, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { validateAssetManifest, validateDesignTokens } from '@sleepy-studio/contracts'

const readJson = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'))
const resolvePath = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url))

const checks = [
  ['assets.json', validateAssetManifest],
  ['tokens/tokens.json', validateDesignTokens],
]

const requiredIcons = [
  ['app-icons/source/app-icon-1024.png', 1024],
  ['app-icons/favicon/favicon-16.png', 16],
  ['app-icons/favicon/favicon-32.png', 32],
  ['app-icons/favicon/favicon-48.png', 48],
  ['app-icons/favicon/favicon-64.png', 64],
  ['app-icons/pwa/icon-192.png', 192],
  ['app-icons/pwa/icon-512.png', 512],
  ['app-icons/pwa/icon-maskable-192.png', 192],
  ['app-icons/pwa/icon-maskable-512.png', 512],
  ['app-icons/apple/apple-touch-icon.png', 180],
  ['app-icons/linux/16x16/sleepy-studio.png', 16],
  ['app-icons/linux/32x32/sleepy-studio.png', 32],
  ['app-icons/linux/48x48/sleepy-studio.png', 48],
  ['app-icons/linux/64x64/sleepy-studio.png', 64],
  ['app-icons/linux/128x128/sleepy-studio.png', 128],
  ['app-icons/linux/256x256/sleepy-studio.png', 256],
  ['app-icons/linux/512x512/sleepy-studio.png', 512],
]

const requiredBinaryIcons = [
  'favicon.ico',
  'app-icons/favicon/favicon.ico',
  'app-icons/windows/sleepy-studio.ico',
  'app-icons/macos/sleepy-studio.icns',
]

let failed = false
for (const [path, validate] of checks) {
  const result = validate(await readJson(path))
  if (result.valid) {
    console.log(`valid: ${path}`)
    continue
  }
  failed = true
  console.error(`invalid: ${path}`)
  for (const error of result.errors) {
    console.error(`  ${error.instancePath || '/'} ${error.message ?? 'validation error'}`)
  }
}

for (const [path, expectedSize] of requiredIcons) {
  try {
    const metadata = await sharp(resolvePath(path)).metadata()
    if (metadata.width !== expectedSize || metadata.height !== expectedSize) {
      failed = true
      console.error(`invalid: ${path} expected ${expectedSize}x${expectedSize}, received ${metadata.width}x${metadata.height}`)
    } else {
      console.log(`valid: ${path}`)
    }
  } catch {
    failed = true
    console.error(`missing or unreadable: ${path}`)
  }
}

for (const path of requiredBinaryIcons) {
  try {
    await access(resolvePath(path))
    console.log(`valid: ${path}`)
  } catch {
    failed = true
    console.error(`missing: ${path}`)
  }
}

if (failed) process.exitCode = 1
