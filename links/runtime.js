export const brandLinks = Object.freeze({
  github: 'https://github.com/Sleepy-Studio',
  sponsors: 'https://github.com/sponsors/sleepy-studio',
  x: 'https://x.com/TheSleepyStudio',
  website: 'https://sleepystudio.xyz',
  email: 'mailto:Contact@SleepyStudio.xyz',
})

export const brandLinkIds = Object.freeze(Object.keys(brandLinks))

export function getBrandLink(id) {
  const href = brandLinks[id]
  if (!href) throw new Error(`Unknown Brand link: ${id}`)
  return href
}
