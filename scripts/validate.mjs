import { readFile } from 'node:fs/promises'
import { validateAssetManifest, validateDesignTokens } from '@sleepy-studio/contracts'

const readJson = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'))

const checks = [
  ['assets.json', validateAssetManifest],
  ['tokens/tokens.json', validateDesignTokens],
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

if (failed) process.exitCode = 1
