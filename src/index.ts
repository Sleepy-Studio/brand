/**
 * Phase 2: Cloudflare Worker API
 * Phase 3: TypeScript SDK Client
 * Phase 4-8: Integrated
 */

export interface Asset {
  id: string
  name: string
  description: string
  added: string
  variants: Variant[]
}

export interface Variant {
  format: string
  file: string
  size_kb: number
  url: string
  mime: string
}

export class BrandingClient {
  private baseUrl: string
  private manifestCache: Map<string, any> = new Map()
  private cacheTTL: number = 3600000 // 1 hour

  constructor(baseUrl: string = 'https://branding.sleepystudio.xyz') {
    this.baseUrl = baseUrl
  }

  async getAsset(assetId: string, format?: string): Promise<Variant | null> {
    const manifest = await this.getManifest()
    const asset = manifest.assets?.find((a: Asset) => a.id === assetId)
    
    if (!asset) return null
    
    if (format) {
      return asset.variants.find((v: Variant) => v.format === format) || null
    }
    
    return asset.variants[0] || null
  }

  async getAssets(): Promise<Asset[]> {
    const manifest = await this.getManifest()
    return manifest.assets || []
  }

  async search(query: string): Promise<Asset[]> {
    const manifest = await this.getManifest()
    const q = query.toLowerCase()
    return manifest.assets?.filter((a: Asset) =>
      a.name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q)
    ) || []
  }

  async getManifest(): Promise<any> {
    const cached = this.manifestCache.get('manifest')
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data
    }

    const response = await fetch(`${this.baseUrl}/assets.json`)
    const manifest = await response.json()
    
    this.manifestCache.set('manifest', {
      data: manifest,
      timestamp: Date.now()
    })
    
    return manifest
  }
}

// React Hooks (Phase 4)
export function useAsset(assetId: string, format?: string) {
  const [asset, setAsset] = React.useState<Variant | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const client = React.useRef(new BrandingClient())

  React.useEffect(() => {
    client.current.getAsset(assetId, format)
      .then(setAsset)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [assetId, format])

  return { asset, loading, error }
}

// React Component (Phase 4)
export function AssetImage({ 
  assetId, 
  format, 
  alt,
  className 
}: { 
  assetId: string
  format?: string
  alt?: string
  className?: string
}) {
  const { asset, loading, error } = useAsset(assetId, format)
  
  if (loading) return <div className={className}>Loading...</div>
  if (error || !asset) return <div className={className}>Asset not found</div>
  
  return (
    <img
      src={asset.url}
      alt={alt || asset.id}
      className={className}
      loading="lazy"
    />
  )
}

// Vue Composable (Phase 4)
export function useAssetVue(assetId: string, format?: string) {
  const asset = Vue.ref<Variant | null>(null)
  const loading = Vue.ref(true)
  const error = Vue.ref<string | null>(null)
  const client = new BrandingClient()

  Vue.onMounted(async () => {
    try {
      const result = await client.getAsset(assetId, format)
      asset.value = result
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  })

  return { asset, loading, error }
}

// Svelte Store (Phase 4)
export function createAssetStore(assetId: string, format?: string) {
  const { subscribe, set } = Svelte.writable<{
    asset: Variant | null
    loading: boolean
    error: string | null
  }>({
    asset: null,
    loading: true,
    error: null
  })

  const client = new BrandingClient()
  
  client.getAsset(assetId, format)
    .then(asset => set({ asset, loading: false, error: null }))
    .catch(err => set({ asset: null, loading: false, error: err.message }))

  return { subscribe }
}
