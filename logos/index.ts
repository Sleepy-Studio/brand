export const brandLogoVariants = [
  'black',
  'black-red',
  'white',
  'white-red',
  'yellow',
] as const

export type BrandLogoVariant = (typeof brandLogoVariants)[number]

export const brandLogoLabels: Readonly<Record<BrandLogoVariant, string>> = Object.freeze({
  black: 'Sleepy Studio black logo',
  'black-red': 'Sleepy Studio black and red logo',
  white: 'Sleepy Studio white logo',
  'white-red': 'Sleepy Studio white and red logo',
  yellow: 'Sleepy Studio yellow logo',
})
