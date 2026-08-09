import { createLogoMotion } from '../logo-motion/dom'
import type { LogoMotionSource } from '../logo-motion/types'
import {
  normalizeAudioAnalysisFrame,
  type AudioAnalysisFrame,
  type AudioReactiveLogoController,
  type AudioReactiveLogoOptions,
} from './types'
import './audio-reactive-logo.css'

const idleFrame: AudioAnalysisFrame = {
  amplitude: 0,
  bass: 0,
  mid: 0,
  treble: 0,
  beat: 0,
  playing: false,
}

export async function createAudioReactiveLogo(
  source: LogoMotionSource,
  options: AudioReactiveLogoOptions = {},
): Promise<AudioReactiveLogoController> {
  const sensitivity = Math.max(0, options.sensitivity ?? 1)
  const smoothing = Math.min(.98, Math.max(0, options.smoothing ?? .72))
  const maxScale = Math.max(1, options.maxScale ?? 1.09)
  const maxGlow = Math.max(0, options.maxGlow ?? 28)
  const reducedMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  let current = idleFrame

  const motion = await createLogoMotion(source, {
    mode: 'idle',
    label: options.label ?? 'Audio reactive Sleepy Studio logo',
    decorative: options.decorative,
    fetcher: options.fetcher,
  })

  const element = document.createElement('div')
  element.className = `s-audio-reactive-logo${options.className ? ` ${options.className}` : ''}`
  element.dataset.playing = 'false'
  const visual = document.createElement('div')
  visual.className = 's-audio-reactive-logo__visual'
  visual.append(motion.element)
  element.append(visual)

  const apply = (incoming: AudioAnalysisFrame) => {
    const next = normalizeAudioAnalysisFrame(incoming)
    current = {
      amplitude: current.amplitude * smoothing + next.amplitude * (1 - smoothing),
      bass: current.bass * smoothing + next.bass * (1 - smoothing),
      mid: current.mid * smoothing + next.mid * (1 - smoothing),
      treble: current.treble * smoothing + next.treble * (1 - smoothing),
      beat: current.beat * smoothing + next.beat * (1 - smoothing),
      playing: next.playing,
    }
    element.dataset.playing = String(current.playing)
    if (reducedMotion) return

    const energy = Math.min(1, (current.amplitude * .42 + current.bass * .34 + current.beat * .24) * sensitivity)
    const scale = current.playing ? 1 + (maxScale - 1) * energy : 1
    const glow = current.playing ? maxGlow * Math.min(1, (energy + current.treble * .25) * sensitivity) : 0
    const field = current.playing ? Math.min(1, (current.mid * .6 + current.treble * .4) * sensitivity) : 0

    element.style.setProperty('--s-audio-logo-scale', scale.toFixed(4))
    element.style.setProperty('--s-audio-logo-glow', `${glow.toFixed(2)}px`)
    element.style.setProperty('--s-audio-logo-ring-scale', (1 + field * .12).toFixed(4))
    element.style.setProperty('--s-audio-logo-ring-opacity', (.18 + field * .55).toFixed(4))
    element.style.setProperty('--s-audio-logo-field-opacity', Math.min(.72, glow / Math.max(maxGlow, 1)).toFixed(4))
  }

  apply(idleFrame)
  return {
    element,
    setFrame: apply,
    reset() {
      current = idleFrame
      apply(idleFrame)
    },
    destroy() {
      motion.destroy()
      element.remove()
    },
  }
}

export type {
  AudioAnalysisFrame,
  AudioReactiveLogoController,
  AudioReactiveLogoOptions,
} from './types'
export { normalizeAudioAnalysisFrame } from './types'
