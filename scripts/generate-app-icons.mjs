import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const sourceLogo = join(root, 'logos/png/sleepyyellow.png')
const outputRoot = join(root, 'app-icons')

const palette = {
  tile: '#161616',
  transparent: { r: 0, g: 0, b: 0, alpha: 0 },
}

const faviconSizes = [16, 32, 48, 64]
const linuxSizes = [16, 32, 48, 64, 128, 256, 512]
const windowsSizes = [16, 24, 32, 48, 64, 128, 256]
const macSizes = [16, 32, 64, 128, 256, 512, 1024]
const generatedDirectories = ['source', 'favicon', 'pwa', 'apple', 'linux', 'windows', 'macos']

async function ensureParent(path) {
  await mkdir(dirname(path), { recursive: true })
}

function roundedTileSvg(size, radius = 0.22) {
  const corner = Math.round(size * radius)
  return Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" rx="${corner}" fill="${palette.tile}"/></svg>`)
}

async function createTile(size, { maskable = false } = {}) {
  const safeArea = maskable ? 0.22 : 0.13
  const logoSize = Math.round(size * (1 - safeArea * 2))
  const offset = Math.round((size - logoSize) / 2)
  const logo = await sharp(sourceLogo)
    .resize(logoSize, logoSize, { fit: 'contain' })
    .png()
    .toBuffer()

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: palette.transparent,
    },
  })
    .composite([
      { input: roundedTileSvg(size), left: 0, top: 0 },
      { input: logo, left: offset, top: offset },
    ])
    .png()
    .toBuffer()
}

function icoBuffer(images) {
  const headerSize = 6 + images.length * 16
  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)

  let offset = headerSize
  images.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16
    header[entry] = size >= 256 ? 0 : size
    header[entry + 1] = size >= 256 ? 0 : size
    header[entry + 2] = 0
    header[entry + 3] = 0
    header.writeUInt16LE(1, entry + 4)
    header.writeUInt16LE(32, entry + 6)
    header.writeUInt32LE(data.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += data.length
  })

  return Buffer.concat([header, ...images.map(({ data }) => data)])
}

function icnsChunk(type, data) {
  const header = Buffer.alloc(8)
  header.write(type, 0, 4, 'ascii')
  header.writeUInt32BE(data.length + 8, 4)
  return Buffer.concat([header, data])
}

function icnsBuffer(images) {
  const typeBySize = new Map([
    [16, 'icp4'],
    [32, 'icp5'],
    [64, 'icp6'],
    [128, 'ic07'],
    [256, 'ic08'],
    [512, 'ic09'],
    [1024, 'ic10'],
  ])
  const chunks = images.map(({ size, data }) => icnsChunk(typeBySize.get(size), data))
  const total = 8 + chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const header = Buffer.alloc(8)
  header.write('icns', 0, 4, 'ascii')
  header.writeUInt32BE(total, 4)
  return Buffer.concat([header, ...chunks])
}

async function writePng(path, size, options) {
  await ensureParent(path)
  await writeFile(path, await createTile(size, options))
}

async function main() {
  await readFile(sourceLogo)
  await mkdir(outputRoot, { recursive: true })
  await Promise.all(generatedDirectories.map((directory) => rm(join(outputRoot, directory), { recursive: true, force: true })))

  await writePng(join(outputRoot, 'source/app-icon-1024.png'), 1024)

  for (const size of faviconSizes) {
    await writePng(join(outputRoot, `favicon/favicon-${size}.png`), size)
  }

  const faviconFrames = await Promise.all(faviconSizes.map(async (size) => ({ size, data: await createTile(size) })))
  const favicon = icoBuffer(faviconFrames)
  await writeFile(join(outputRoot, 'favicon/favicon.ico'), favicon)
  await writeFile(join(root, 'favicon.ico'), favicon)

  await writePng(join(outputRoot, 'pwa/icon-192.png'), 192)
  await writePng(join(outputRoot, 'pwa/icon-512.png'), 512)
  await writePng(join(outputRoot, 'pwa/icon-maskable-192.png'), 192, { maskable: true })
  await writePng(join(outputRoot, 'pwa/icon-maskable-512.png'), 512, { maskable: true })
  await writePng(join(outputRoot, 'apple/apple-touch-icon.png'), 180)

  for (const size of linuxSizes) {
    await writePng(join(outputRoot, `linux/${size}x${size}/sleepy-studio.png`), size)
  }

  const windowsFrames = await Promise.all(windowsSizes.map(async (size) => ({ size, data: await createTile(size) })))
  await ensureParent(join(outputRoot, 'windows/sleepy-studio.ico'))
  await writeFile(join(outputRoot, 'windows/sleepy-studio.ico'), icoBuffer(windowsFrames))

  const macFrames = await Promise.all(macSizes.map(async (size) => ({ size, data: await createTile(size) })))
  await ensureParent(join(outputRoot, 'macos/sleepy-studio.icns'))
  await writeFile(join(outputRoot, 'macos/sleepy-studio.icns'), icnsBuffer(macFrames))

  console.log('Generated canonical Sleepy Studio app icons in app-icons/.')
}

await main()
