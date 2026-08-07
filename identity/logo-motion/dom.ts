import type {
  LogoMotionController,
  LogoMotionMode,
  LogoMotionOptions,
  LogoMotionSource,
} from './types'
import './logo-motion.css'

const SVG_NS = 'http://www.w3.org/2000/svg'

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

function prepareLayers(svg: SVGSVGElement): void {
  const children = [...svg.children].filter((child): child is SVGElement => child instanceof SVGElement)
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
      // Ignore invalid consumer selectors and continue to safe fallbacks.
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

function prepareOrbit(svg: SVGSVGElement, selector?: string): void {
  const source = findOrbitSource(svg, selector)
  if (!source) return
  try {
    const viewBox = getViewBox(svg)
    const contentBox = svg.getBBox()
    const sourceBox = source.getBBox()
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
    const copy = source.cloneNode(true) as SVGGraphicsElement
    copy.removeAttribute('id')
    copy.classList.remove('s-logo-motion__layer')
    copy.classList.add('s-logo-motion__orbit-copy')
    copy.setAttribute('transform', `translate(${-sourceCenterX} ${-orbitRadius - sourceCenterY})`)
    source.classList.add('s-logo-motion__orbit-source')
    rotor.append(copy)
    anchor.append(rotor)
    svg.append(anchor)
  } catch {
    // Orbit stays unavailable when geometry cannot be measured.
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
  let progress = clampProgress(options.progress ?? 0)

  const svg = await resolveSvg(source, fetcher)
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

export type { LogoMotionController, LogoMotionMode, LogoMotionOptions, LogoMotionSource } from './types'
