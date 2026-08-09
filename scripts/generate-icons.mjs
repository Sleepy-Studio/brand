import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const manifest = JSON.parse(await readFile(resolve(root, 'icons/icons.json'), 'utf8'))
const lucideRoot = resolve(root, 'node_modules/lucide-static/icons')
const outputRoot = resolve(root, 'icons/svg')

await mkdir(outputRoot, { recursive: true })

let generated = 0
for (const [id, definition] of Object.entries(manifest.icons)) {
  if (definition.source && definition.source !== 'lucide') continue
  const source = resolve(lucideRoot, `${definition.glyph}.svg`)
  const target = resolve(outputRoot, `${id}.svg`)
  await copyFile(source, target)
  generated += 1
}

console.log(`Generated ${generated} approved Lucide-derived Brand icons; retained checked-in non-Lucide marks.`)
