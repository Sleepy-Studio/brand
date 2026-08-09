export type LogoAsciiColorMode = 'mono' | 'source'
export type LogoAsciiSource = string | SVGSVGElement

export interface LogoAsciiOptions {
  width?: number
  characters?: string
  invert?: boolean
  colorMode?: LogoAsciiColorMode
  fit?: boolean
  label?: string
  className?: string
  fetcher?: typeof fetch
}

export interface LogoAsciiController {
  element: HTMLPreElement
  setWidth(width: number): Promise<void>
  setCharacters(characters: string): Promise<void>
  setInvert(invert: boolean): Promise<void>
  setColorMode(colorMode: LogoAsciiColorMode): Promise<void>
  fit(): void
  render(): Promise<void>
  destroy(): void
}
