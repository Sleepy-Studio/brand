import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const source = join(root, 'logos/svg/LogoYellow.svg')
const output = join(root, 'logos/webp/LogoYellow.webp')

await mkdir(dirname(output), { recursive: true })
await sharp(source)
  .webp({ lossless: true })
  .toFile(output)

console.log('Generated logos/webp/LogoYellow.webp from canonical LogoYellow.svg.')
