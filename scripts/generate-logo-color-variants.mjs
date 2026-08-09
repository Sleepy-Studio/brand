import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const sourcePath = join(root, 'logos/svg/LogoBlackRed.svg')
const blackPath = join(root, 'logos/svg/LogoBlack.svg')
const redPath = join(root, 'logos/svg/LogoRed.svg')

const source = await readFile(sourcePath, 'utf8')

function recolor(svg, color) {
  return svg
    .replaceAll('#c73639ff', `${color}ff`)
    .replaceAll('#c73639', color)
    .replaceAll('#000000ff', `${color}ff`)
    .replaceAll('#000000', color)
}

await writeFile(blackPath, recolor(source, '#0a0a0a'))
await writeFile(redPath, recolor(source, '#d1393e'))

console.log('Generated LogoBlack.svg and LogoRed.svg from LogoBlackRed.svg geometry.')
