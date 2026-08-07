import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const manifest = JSON.parse(await readFile(resolve(root, 'icons/icons.json'), 'utf8'))
const sourceRoot = resolve(root, 'node_modules/lucide-static/icons')
const outputRoot = resolve(root, 'icons/svg')

await mkdir(outputRoot, { recursive: true })

for (const [id, definition] of Object.entries(manifest.icons)) {
  const source = resolve(sourceRoot, `${definition.glyph}.svg`)
  const target = resolve(outputRoot, `${id}.svg`)
  await copyFile(source, target)
}

console.log(`Generated ${Object.keys(manifest.icons).length} approved Brand icons from Lucide.`)
