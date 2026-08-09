export const brandAssetUrls = Object.freeze({
  'logo-black': new URL('../logos/svg/LogoBlack.svg', import.meta.url).href,
  'logo-red': new URL('../logos/svg/LogoRed.svg', import.meta.url).href,
  'logo-black-red': new URL('../logos/svg/LogoBlackRed.svg', import.meta.url).href,
  'logo-white': new URL('../logos/svg/LogoWhite.svg', import.meta.url).href,
  'logo-white-red': new URL('../logos/svg/LogoWhiteRed.svg', import.meta.url).href,
  'logo-yellow': new URL('../logos/svg/LogoYellow.svg', import.meta.url).href,
  'logo-yellow-webp': new URL('../logos/webp/LogoYellow.webp', import.meta.url).href,
  'logo-3d': new URL('../logos/glb/SleepyLogo3d.glb', import.meta.url).href,
  favicon: new URL('../favicon.ico', import.meta.url).href,
})

export const brandAssetCatalog = Object.freeze([
  Object.freeze({
    id: 'logo-black',
    name: 'Logo Black',
    kind: 'logo',
    variants: Object.freeze([
      Object.freeze({ format: 'svg', file: 'LogoBlack.svg', mime: 'image/svg+xml', url: brandAssetUrls['logo-black'] }),
    ]),
  }),
  Object.freeze({
    id: 'logo-red',
    name: 'Logo Red',
    kind: 'logo',
    variants: Object.freeze([
      Object.freeze({ format: 'svg', file: 'LogoRed.svg', mime: 'image/svg+xml', url: brandAssetUrls['logo-red'] }),
    ]),
  }),
  Object.freeze({
    id: 'logo-black-red',
    name: 'Logo Black Red',
    kind: 'logo',
    variants: Object.freeze([
      Object.freeze({ format: 'svg', file: 'LogoBlackRed.svg', mime: 'image/svg+xml', url: brandAssetUrls['logo-black-red'] }),
    ]),
  }),
  Object.freeze({
    id: 'logo-white',
    name: 'Logo White',
    kind: 'logo',
    variants: Object.freeze([
      Object.freeze({ format: 'svg', file: 'LogoWhite.svg', mime: 'image/svg+xml', url: brandAssetUrls['logo-white'] }),
    ]),
  }),
  Object.freeze({
    id: 'logo-white-red',
    name: 'Logo White Red',
    kind: 'logo',
    variants: Object.freeze([
      Object.freeze({ format: 'svg', file: 'LogoWhiteRed.svg', mime: 'image/svg+xml', url: brandAssetUrls['logo-white-red'] }),
    ]),
  }),
  Object.freeze({
    id: 'logo-yellow',
    name: 'Logo Yellow',
    kind: 'logo',
    variants: Object.freeze([
      Object.freeze({ format: 'svg', file: 'LogoYellow.svg', mime: 'image/svg+xml', url: brandAssetUrls['logo-yellow'] }),
      Object.freeze({ format: 'webp', file: 'LogoYellow.webp', mime: 'image/webp', url: brandAssetUrls['logo-yellow-webp'] }),
    ]),
  }),
  Object.freeze({
    id: 'logo-3d',
    name: 'Logo 3D',
    kind: 'logo',
    variants: Object.freeze([
      Object.freeze({ format: 'glb', file: 'SleepyLogo3d.glb', mime: 'model/gltf-binary', url: brandAssetUrls['logo-3d'] }),
    ]),
  }),
  Object.freeze({
    id: 'favicon',
    name: 'Favicon',
    kind: 'app-icon',
    variants: Object.freeze([
      Object.freeze({ format: 'ico', file: 'favicon.ico', mime: 'image/x-icon', url: brandAssetUrls.favicon }),
    ]),
  }),
])

export const brandAssetIds = Object.freeze(Object.keys(brandAssetUrls))

export function getBrandAssetUrl(id) {
  const url = brandAssetUrls[id]
  if (!url) throw new Error(`Unknown Brand asset: ${id}`)
  return url
}
