export type SleepyWordmarkMotionVariant = 'wordmark' | 'frens'

export interface SleepyWordmarkMotionOptions {
  variant?: SleepyWordmarkMotionVariant
  label?: string
  className?: string
  decorative?: boolean
  frensLabel?: string
}

export interface SleepyWordmarkMotionController {
  element: HTMLDivElement
  object: HTMLObjectElement
  destroy(): void
}
