import type { LogoAsciiColorMode, LogoAsciiController, LogoAsciiOptions, LogoAsciiSource } from './types'
import './logo-ascii.css'

const DEFAULT_CHARACTERS = ' .:-=+*#%@'
const SVG_NS = 'http://www.w3.org/2000/svg'

function clampWidth(value: number): number {
  return Math.min(160, Math.max(16, Math.round(Number.isFinite(value) ? value : 64)))
}

function sanitizeSvg(svg: SVGSVGElement): SVGSVGElement {
  for (const node of svg.querySelectorAll('script, foreignObject')) node.remove()
  for (const element of svg.querySelectorAll('*')) {
    for (const attribute of [...element.attributes]) {
      const name = attribute.name.toLowerCase()
      const value = attribute.value.trim().toLowerCase()
      if (name.startsWith('on') || value.startsWith('javascript:')) element.removeAttribute(attribute.name)
    }
  }
  return svg
}

function parseSvg(markup: string): SVGSVGElement {
  const parsed = new DOMParser().parseFromString(markup, 'image/svg+xml')
  const svg = parsed.documentElement
  if (parsed.querySelector('parsererror') || svg.namespaceURI !== SVG_NS || svg.localName !== 'svg') throw new Error('LogoAscii source did not contain a valid SVG document.')
  return sanitizeSvg(svg as unknown as SVGSVGElement)
}

async function resolveMarkup(source: LogoAsciiSource, fetcher: typeof fetch): Promise<string> {
  if (source instanceof SVGSVGElement) return new XMLSerializer().serializeToString(sanitizeSvg(source.cloneNode(true) as SVGSVGElement))
  if (source.trimStart().startsWith('<svg')) return new XMLSerializer().serializeToString(parseSvg(source))
  const response = await fetcher(source)
  if (!response.ok) throw new Error(`Unable to load SVG logo (${response.status}).`)
  return new XMLSerializer().serializeToString(parseSvg(await response.text()))
}

function imageFromMarkup(markup: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }))
    const image = new Image()
    image.onload = () => { URL.revokeObjectURL(url); resolve(image) }
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Unable to rasterize SVG logo for ASCII output.')) }
    image.src = url
  })
}

function toAscii(image: HTMLImageElement, width: number, characters: string, invert: boolean): string {
  const height = Math.max(1, Math.round(width * (image.naturalHeight / Math.max(1, image.naturalWidth)) * 0.5))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Canvas 2D rendering is unavailable.')
  context.clearRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)
  const pixels = context.getImageData(0, 0, width, height).data
  const ramp = characters || DEFAULT_CHARACTERS
  const lines: string[] = []
  for (let y = 0; y < height; y += 1) {
    let line = ''
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4
      const alpha = pixels[offset + 3] / 255
      const luminance = (pixels[offset] * 0.2126 + pixels[offset + 1] * 0.7152 + pixels[offset + 2] * 0.0722) / 255
      const density = alpha * (invert ? 1 - luminance : 1)
      const index = Math.min(ramp.length - 1, Math.round(density * (ramp.length - 1)))
      line += alpha < 0.04 ? ' ' : ramp[index]
    }
    lines.push(line.replace(/\s+$/, ''))
  }
  return lines.join('\n').replace(/\n+$/, '')
}

export async function createLogoAscii(source: LogoAsciiSource, options: LogoAsciiOptions = {}): Promise<LogoAsciiController> {
  const markup = await resolveMarkup(source, options.fetcher ?? fetch)
  const image = await imageFromMarkup(markup)
  let width = clampWidth(options.width ?? 64)
  let characters = options.characters ?? DEFAULT_CHARACTERS
  let invert = options.invert ?? false
  let colorMode: LogoAsciiColorMode = options.colorMode ?? 'mono'

  const element = document.createElement('pre')
  element.className = `s-logo-ascii${options.className ? ` ${options.className}` : ''}`
  element.setAttribute('role', 'img')
  element.setAttribute('aria-label', options.label ?? 'Sleepy Studio ASCII logo')

  const fit = () => {
    if (options.fit === false || !element.parentElement) return
    element.style.removeProperty('font-size')
    const parent = element.parentElement
    const scale = Math.min(1, parent.clientWidth / Math.max(1, element.scrollWidth), parent.clientHeight / Math.max(1, element.scrollHeight))
    const base = Number.parseFloat(getComputedStyle(element).fontSize) || 10
    element.style.fontSize = `${Math.max(2, base * scale)}px`
  }

  const render = async () => {
    element.dataset.colorMode = colorMode
    element.textContent = toAscii(image, width, characters, invert)
    requestAnimationFrame(fit)
  }

  await render()
  return {
    element,
    async setWidth(next) { width = clampWidth(next); await render() },
    async setCharacters(next) { characters = next || DEFAULT_CHARACTERS; await render() },
    async setInvert(next) { invert = next; await render() },
    async setColorMode(next) { colorMode = next; await render() },
    fit,
    render,
    destroy() { element.remove() },
  }
}

export type { LogoAsciiColorMode, LogoAsciiController, LogoAsciiOptions, LogoAsciiSource } from './types'
