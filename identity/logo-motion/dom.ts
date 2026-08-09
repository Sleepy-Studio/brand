import type {
  LogoMotionController,
  LogoMotionMode,
  LogoMotionOptions,
  LogoMotionSource,
  LogoMotionTint,
} from './types'
import './logo-motion.css'

const SVG_NS = 'http://www.w3.org/2000/svg'
const TINTS: Record<Exclude<LogoMotionTint, 'source'>, string> = {
  white: '#ffffff',
  yellow: '#f4c542',
  black: '#000000',
  red: '#d1393e',
}

function clampProgress(progress: number): number {
  return Math.min(100, Math.max(0, Number.isFinite(progress) ? progress : 0))
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
  svg.removeAttribute('width')
  svg.removeAttribute('height')
  svg.setAttribute('focusable', 'false')
  svg.setAttribute('aria-hidden', 'true')
  return svg
}

function parseSvg(markup: string): SVGSVGElement {
  const parsed = new DOMParser().parseFromString(markup, 'image/svg+xml')
  const svg = parsed.documentElement
  if (parsed.querySelector('parsererror') || svg.namespaceURI !== SVG_NS || svg.localName !== 'svg') {
    throw new Error('LogoMotion source did not contain a valid SVG document.')
  }
  return sanitizeSvg(svg as unknown as SVGSVGElement)
}

async function resolveSvg(source: LogoMotionSource, fetcher: typeof fetch): Promise<SVGSVGElement> {
  if (source instanceof SVGSVGElement) return sanitizeSvg(source.cloneNode(true) as SVGSVGElement)
  if (source.trimStart().startsWith('<svg')) return parseSvg(source)
  const response = await fetcher(source)
  if (!response.ok) throw new Error(`Unable to load SVG logo (${response.status}).`)
  return parseSvg(await response.text())
}

function applyTint(svg: SVGSVGElement, tint: LogoMotionTint): void {
  if (tint === 'source') return
  const color = TINTS[tint]
  for (const element of svg.querySelectorAll<SVGElement>('*')) {
    const fill = element.getAttribute('fill')
    const stroke = element.getAttribute('stroke')
    if (fill && fill !== 'none' && !fill.startsWith('url(')) element.setAttribute('fill', color)
    if (stroke && stroke !== 'none' && !stroke.startsWith('url(')) element.setAttribute('stroke', color)
  }
}

function prepareLayers(svg: SVGSVGElement): void {
  const children = [...svg.children].filter((child): child is SVGElement => child instanceof SVGElement && child.localName !== 'defs')
  const layers = children.length > 0 ? children : [...svg.querySelectorAll('path')]
  layers.forEach((layer, index) => {
    layer.classList.add('s-logo-motion__layer')
    layer.style.setProperty('--s-logo-motion-layer', String(index))
  })
}

function findOrbitSource(svg: SVGSVGElement, selector?: string): SVGGraphicsElement | null {
  const selectors = [selector, '[data-logo-orbit]', '#logo-orbit', '.logo-orbit', 'svg > g:first-of-type > :first-child']
    .filter((value): value is string => Boolean(value))
  for (const candidate of selectors) {
    try {
      const orbit = svg.querySelector<SVGGraphicsElement>(candidate)
      if (orbit && typeof orbit.getBBox === 'function') return orbit
    } catch {
      // Ignore invalid selectors and continue to canonical fallbacks.
    }
  }
  return null
}

function getViewBox(svg: SVGSVGElement): DOMRect {
  const viewBox = svg.viewBox.baseVal
  if (viewBox.width > 0 && viewBox.height > 0) return new DOMRect(viewBox.x, viewBox.y, viewBox.width, viewBox.height)
  const box = svg.getBBox()
  return new DOMRect(box.x, box.y, box.width, box.height)
}

function ensureDefs(svg: SVGSVGElement): SVGDefsElement {
  const existing = svg.querySelector<SVGDefsElement>(':scope > defs')
  if (existing) return existing
  const defs = document.createElementNS(SVG_NS, 'defs')
  svg.prepend(defs)
  return defs
}

function isolateCanonicalTopCircle(svg: SVGSVGElement, source: SVGGraphicsElement): {
  copy: SVGGraphicsElement
  centerX: number
  centerY: number
  radius: number
} {
  const viewBox = getViewBox(svg)
  const centerX = viewBox.x + viewBox.width * 0.5
  const centerY = viewBox.y + viewBox.height * 0.072
  const radius = Math.min(viewBox.width, viewBox.height) * 0.073
  const defs = ensureDefs(svg)
  const idSeed = Math.random().toString(36).slice(2, 9)

  const clipPath = document.createElementNS(SVG_NS, 'clipPath')
  const clipId = `s-logo-motion-orbit-clip-${idSeed}`
  clipPath.id = clipId
  clipPath.setAttribute('clipPathUnits', 'userSpaceOnUse')
  const clipCircle = document.createElementNS(SVG_NS, 'circle')
  clipCircle.setAttribute('cx', String(centerX))
  clipCircle.setAttribute('cy', String(centerY))
  clipCircle.setAttribute('r', String(radius))
  clipPath.append(clipCircle)
  defs.append(clipPath)

  const mask = document.createElementNS(SVG_NS, 'mask')
  const maskId = `s-logo-motion-orbit-mask-${idSeed}`
  mask.id = maskId
  mask.setAttribute('maskUnits', 'userSpaceOnUse')
  mask.setAttribute('x', String(viewBox.x))
  mask.setAttribute('y', String(viewBox.y))
  mask.setAttribute('width', String(viewBox.width))
  mask.setAttribute('height', String(viewBox.height))

  const maskBase = document.createElementNS(SVG_NS, 'rect')
  maskBase.setAttribute('x', String(viewBox.x))
  maskBase.setAttribute('y', String(viewBox.y))
  maskBase.setAttribute('width', String(viewBox.width))
  maskBase.setAttribute('height', String(viewBox.height))
  maskBase.setAttribute('fill', 'white')

  const maskCircle = document.createElementNS(SVG_NS, 'circle')
  maskCircle.setAttribute('cx', String(centerX))
  maskCircle.setAttribute('cy', String(centerY))
  maskCircle.setAttribute('r', String(radius * 1.015))
  maskCircle.setAttribute('fill', 'black')
  mask.append(maskBase, maskCircle)
  defs.append(mask)

  source.setAttribute('mask', `url(#${maskId})`)
  source.classList.add('s-logo-motion__orbit-source')

  const copy = source.cloneNode(true) as SVGGraphicsElement
  copy.removeAttribute('id')
  copy.removeAttribute('mask')
  copy.classList.remove('s-logo-motion__layer', 's-logo-motion__orbit-source')
  copy.classList.add('s-logo-motion__orbit-copy')
  copy.setAttribute('clip-path', `url(#${clipId})`)

  return { copy, centerX, centerY, radius }
}

function prepareOrbit(svg: SVGSVGElement, selector?: string): void {
  const source = findOrbitSource(svg, selector)
  if (!source) return
  try {
    const viewBox = getViewBox(svg)
    const contentBox = svg.getBBox()
    const canonical = selector ? null : isolateCanonicalTopCircle(svg, source)
    const sourceBox = canonical ? new DOMRect(canonical.centerX - canonical.radius, canonical.centerY - canonical.radius, canonical.radius * 2, canonical.radius * 2) : source.getBBox()
    const centerX = viewBox.x + viewBox.width / 2
    const centerY = viewBox.y + viewBox.height / 2
    const sourceCenterX = sourceBox.x + sourceBox.width / 2
    const sourceCenterY = sourceBox.y + sourceBox.height / 2
    const sourceRadius = Math.max(sourceBox.width, sourceBox.height) / 2
    const leftReach = centerX - contentBox.x
    const rightReach = contentBox.x + contentBox.width - centerX
    const topReach = centerY - contentBox.y
    const bottomReach = contentBox.y + contentBox.height - centerY
    const contentRadius = Math.max(leftReach, rightReach, topReach, bottomReach)
    const gap = Math.max(viewBox.width, viewBox.height) * 0.055
    const orbitRadius = contentRadius + sourceRadius + gap

    const anchor = document.createElementNS(SVG_NS, 'g')
    anchor.classList.add('s-logo-motion__orbit-anchor')
    anchor.setAttribute('transform', `translate(${centerX} ${centerY})`)
    const rotor = document.createElementNS(SVG_NS, 'g')
    rotor.classList.add('s-logo-motion__orbit-rotor')
    const copy = canonical?.copy ?? source.cloneNode(true) as SVGGraphicsElement
    copy.removeAttribute('id')
    copy.classList.remove('s-logo-motion__layer')
    copy.classList.add('s-logo-motion__orbit-copy')
    copy.setAttribute('transform', `translate(${-sourceCenterX} ${-orbitRadius - sourceCenterY})`)
    if (!canonical) source.classList.add('s-logo-motion__orbit-source')
    rotor.append(copy)
    anchor.append(rotor)
    svg.append(anchor)
  } catch {
    // Orbit remains unavailable only when SVG geometry cannot be measured.
  }
}

function setAccessibility(element: HTMLDivElement, mode: LogoMotionMode, label: string, decorative: boolean, progress: number): void {
  if (decorative) {
    element.setAttribute('aria-hidden', 'true')
    element.removeAttribute('role')
    return
  }
  element.removeAttribute('aria-hidden')
  element.setAttribute('aria-label', label)
  if (mode === 'loading' || mode === 'progress' || mode === 'orbit') {
    element.setAttribute('role', 'progressbar')
    element.setAttribute('aria-valuemin', '0')
    element.setAttribute('aria-valuemax', '100')
    if (mode === 'progress') element.setAttribute('aria-valuenow', String(progress))
    else element.removeAttribute('aria-valuenow')
  } else {
    element.setAttribute('role', 'img')
    element.removeAttribute('aria-valuemin')
    element.removeAttribute('aria-valuemax')
    element.removeAttribute('aria-valuenow')
  }
}

export async function createLogoMotion(source: LogoMotionSource, options: LogoMotionOptions = {}): Promise<LogoMotionController> {
  const mode = options.mode ?? 'idle'
  const label = options.label ?? 'Sleepy Studio'
  const decorative = options.decorative ?? false
  const fetcher = options.fetcher ?? fetch
  const tint = options.tint ?? 'source'
  let progress = clampProgress(options.progress ?? 0)

  const svg = await resolveSvg(source, fetcher)
  applyTint(svg, tint)
  svg.classList.add('s-logo-motion__svg')
  prepareLayers(svg)

  const element = document.createElement('div')
  element.className = `s-logo-motion${options.className ? ` ${options.className}` : ''}`
  element.dataset.mode = mode
  element.style.setProperty('--s-logo-motion-progress', `${progress}%`)
  element.append(svg)
  prepareOrbit(svg, options.orbitSelector)

  const progressLayer = document.createElement('div')
  progressLayer.className = 's-logo-motion__progress'
  const progressSvg = svg.cloneNode(true) as SVGSVGElement
  progressSvg.classList.remove('s-logo-motion__svg')
  progressSvg.classList.add('s-logo-motion__progress-svg')
  progressLayer.append(progressSvg)
  element.append(progressLayer)

  setAccessibility(element, mode, label, decorative, progress)

  return {
    element,
    svg,
    setMode(nextMode) {
      element.dataset.mode = nextMode
      setAccessibility(element, nextMode, label, decorative, progress)
    },
    setProgress(nextProgress) {
      progress = clampProgress(nextProgress)
      element.style.setProperty('--s-logo-motion-progress', `${progress}%`)
      if (element.dataset.mode === 'progress' && !decorative) element.setAttribute('aria-valuenow', String(progress))
    },
    destroy() { element.remove() },
  }
}

export type { LogoMotionController, LogoMotionMode, LogoMotionOptions, LogoMotionSource, LogoMotionTint } from './types'
