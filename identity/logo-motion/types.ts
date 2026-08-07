export type LogoMotionMode = 'idle' | 'startup' | 'loading' | 'progress' | 'orbit'
export type LogoMotionSource = string | SVGSVGElement

export interface LogoMotionOptions {
  mode?: LogoMotionMode
  progress?: number
  label?: string
  className?: string
  decorative?: boolean
  fetcher?: typeof fetch
}

export interface LogoMotionController {
  element: HTMLDivElement
  svg: SVGSVGElement
  setMode(mode: LogoMotionMode): void
  setProgress(progress: number): void
  destroy(): void
}
