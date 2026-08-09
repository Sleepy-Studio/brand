export const brandLogoVariants = [
  'black',
  'black-red',
  'white',
  'white-red',
  'yellow',
] as const

export type BrandLogoVariant = (typeof brandLogoVariants)[number]
export type BrandLogoBackdrop = 'light' | 'dark'

export const brandLogoLabels: Readonly<Record<BrandLogoVariant, string>> = Object.freeze({
  black: 'Sleepy Studio black logo',
  'black-red': 'Sleepy Studio black and red logo',
  white: 'Sleepy Studio white logo',
  'white-red': 'Sleepy Studio white and red logo',
  yellow: 'Sleepy Studio yellow logo',
})

export const brandLogoBackdrops: Readonly<Record<BrandLogoVariant, BrandLogoBackdrop>> = Object.freeze({
  black: 'light',
  'black-red': 'light',
  white: 'dark',
  'white-red': 'dark',
  yellow: 'dark',
})
