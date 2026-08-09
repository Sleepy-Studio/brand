export type LogoMotionMode = 'idle' | 'startup' | 'loading' | 'progress' | 'orbit'
export type LogoMotionSource = string | SVGSVGElement
export type LogoMotionTint = 'source' | 'white' | 'yellow' | 'black' | 'red'

export interface LogoMotionOptions {
  mode?: LogoMotionMode
  progress?: number
  label?: string
  className?: string
  decorative?: boolean
  orbitSelector?: string
  tint?: LogoMotionTint
  fetcher?: typeof fetch
}

export interface LogoMotionController {
  element: HTMLDivElement
  svg: SVGSVGElement
  setMode(mode: LogoMotionMode): void
  setProgress(progress: number): void
  destroy(): void
}
