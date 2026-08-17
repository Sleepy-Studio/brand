export declare const brandLinks: Readonly<{
  github: string
  sponsors: string
  x: string
  website: string
  email: string
}>

export declare const brandLinkIds: readonly (keyof typeof brandLinks)[]

export declare function getBrandLink(id: keyof typeof brandLinks): string
