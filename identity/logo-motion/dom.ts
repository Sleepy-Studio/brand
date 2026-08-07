import type { LogoMotionController, LogoMotionMode, LogoMotionOptions, LogoMotionSource } from './types'
import './logo-motion.css'

const SVG_NS = 'http://www.w3.org/2000/svg'

function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0))
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
  const fetcher = options.fetcher ?? fetch
  const svg = await resolveSvg(source, fetcher)
  svg.classList.add('s-logo-motion__svg')
  const mode = options.mode ?? 'idle'
  const label = options.label ?? 'Sleepy Studio'
  const decorative = options.decorative ?? false
  let progress = clampProgress(options.progress ?? 0)

  const element = document.createElement('div')
  element.className = `s-logo-motion${options.className ? ` ${options.className}` : ''}`
  element.dataset.mode = mode
  element.style.setProperty('--s-logo-motion-progress', `${progress}%`)
  element.append(svg)

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
