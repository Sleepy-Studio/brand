import type {
  SleepyWordmarkMotionController,
  SleepyWordmarkMotionOptions,
} from './types.ts'

const wordmarkUrl = new URL('./sleepy-wordmark-animated.svg', import.meta.url).href

export function createSleepyWordmarkMotion(
  options: SleepyWordmarkMotionOptions = {},
): SleepyWordmarkMotionController {
  const {
    variant = 'wordmark',
    label = variant === 'frens' ? 'Sleepy frens ecosystem' : 'Sleepy',
    className,
    decorative = false,
    frensLabel = 'frens',
  } = options

  const element = document.createElement('div')
  element.className = [
    'sleepy-wordmark-motion',
    `sleepy-wordmark-motion--${variant}`,
    className,
  ].filter(Boolean).join(' ')

  if (decorative) {
    element.setAttribute('aria-hidden', 'true')
  } else {
    element.setAttribute('role', 'img')
    element.setAttribute('aria-label', label)
  }

  const object = document.createElement('object')
  object.className = 'sleepy-wordmark-motion__wordmark'
  object.data = wordmarkUrl
  object.type = 'image/svg+xml'
  object.tabIndex = -1
  object.setAttribute('aria-hidden', 'true')
  element.append(object)

  if (variant === 'frens') {
    const frens = document.createElement('span')
    frens.className = 'sleepy-wordmark-motion__frens'
    frens.textContent = frensLabel

    const colon = document.createElement('span')
    colon.className = 'sleepy-wordmark-motion__colon'
    colon.textContent = ':'
    colon.setAttribute('aria-hidden', 'true')

    frens.append(colon)
    element.append(frens)
  }

  return {
    element,
    object,
    destroy() {
      element.remove()
    },
  }
}
