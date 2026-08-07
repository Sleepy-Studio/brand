export type BrandAssetId = 'logo-black' | 'logo-black-red' | 'logo-white' | 'logo-white-red' | 'logo-yellow' | 'favicon'
export const brandAssetUrls: Readonly<Record<BrandAssetId, string>>
export const brandAssetIds: readonly BrandAssetId[]
export function getBrandAssetUrl(id: BrandAssetId): string
