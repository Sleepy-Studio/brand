export const brandAssetUrls = Object.freeze({
  'logo-black': new URL('../logos/svg/LogoBlack.svg', import.meta.url).href,
  'logo-black-red': new URL('../logos/svg/LogoBlackRed.svg', import.meta.url).href,
  'logo-white': new URL('../logos/svg/LogoWhite.svg', import.meta.url).href,
  'logo-white-red': new URL('../logos/svg/LogoWhiteRed.svg', import.meta.url).href,
  'logo-yellow': new URL('../logos/svg/LogoYellow.svg', import.meta.url).href,
  favicon: new URL('../favicon.ico', import.meta.url).href,
})

export const brandAssetIds = Object.freeze(Object.keys(brandAssetUrls))

export function getBrandAssetUrl(id) {
  const url = brandAssetUrls[id]
  if (!url) throw new Error(`Unknown Brand asset: ${id}`)
  return url
}
