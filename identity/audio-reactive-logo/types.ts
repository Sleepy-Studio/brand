export interface AudioAnalysisFrame {
  amplitude: number
  bass: number
  mid: number
  treble: number
  beat: number
  playing: boolean
}

export interface AudioReactiveLogoOptions {
  label?: string
  className?: string
  decorative?: boolean
  sensitivity?: number
  smoothing?: number
  maxScale?: number
  maxGlow?: number
  fetcher?: typeof fetch
}

export interface AudioReactiveLogoController {
  element: HTMLDivElement
  setFrame(frame: AudioAnalysisFrame): void
  reset(): void
  destroy(): void
}

export function normalizeAudioAnalysisFrame(frame: AudioAnalysisFrame): AudioAnalysisFrame {
  const clamp = (value: number) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0))
  return {
    amplitude: clamp(frame.amplitude),
    bass: clamp(frame.bass),
    mid: clamp(frame.mid),
    treble: clamp(frame.treble),
    beat: clamp(frame.beat),
    playing: Boolean(frame.playing),
  }
}
