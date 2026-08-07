export type BrandIconId =
  | 'profile'
  | 'open'
  | 'download'
  | 'delete'
  | 'check'
  | 'save'
  | 'settings'
  | 'add'
  | 'search'
  | 'menu'

export const brandIcons: Readonly<Record<BrandIconId, string>>
export const brandIconIds: readonly BrandIconId[]
export function getBrandIcon(id: BrandIconId): string
