export type BrandIconId =
  | 'profile'
  | 'open'
  | 'view'
  | 'open-new-tab'
  | 'download'
  | 'delete'
  | 'check'
  | 'save'
  | 'settings'
  | 'add'
  | 'search'
  | 'menu'
  | 'github'
  | 'x'

export const brandIcons: Readonly<Record<BrandIconId, string>>
export const brandIconIds: readonly BrandIconId[]
export function getBrandIcon(id: BrandIconId): string
