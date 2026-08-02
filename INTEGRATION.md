# Integration & Implementation Guide

How to use, embed, and integrate Sleepy Studio brand assets into your apps, websites, and platforms.

## Table of Contents

1. [Quick Integration](#quick-integration)
2. [Fetch Methods](#fetch-methods)
3. [Embedding & Display](#embedding--display)
4. [Platform-Specific Guides](#platform-specific-guides)
5. [SDK & Libraries](#sdk--libraries)
6. [Advanced Interoperability](#advanced-interoperability)
7. [Performance & Caching](#performance--caching)

---

## Quick Integration

### HTML/Web

```html
<!-- Logo -->
<img src="https://raw.githubusercontent.com/Sleepy-Studio/branding/main/logos/svg/LogoBlack.svg" 
     alt="Sleepy Studio" class="logo" />

<!-- Optimized (with cache headers) -->
<link rel="preload" as="image" href="https://raw.githubusercontent.com/Sleepy-Studio/branding/main/logos/svg/LogoBlack.svg" />

<!-- Responsive with srcset -->
<img srcset="https://raw.githubusercontent.com/Sleepy-Studio/branding/main/characters/png/sleepyyellow.png 1x,
             https://raw.githubusercontent.com/Sleepy-Studio/branding/main/characters/png/sleepyyellow.png 2x"
     src="https://raw.githubusercontent.com/Sleepy-Studio/branding/main/characters/png/sleepyyellow.png"
     alt="Sleepy Character" />
```

### React/Vue/Svelte

```typescript
// React Hook
import { useState, useEffect } from 'react'

const useAsset = (assetId: string, format?: string) => {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const manifest = await fetch(
          'https://raw.githubusercontent.com/Sleepy-Studio/branding/main/assets.json'
        ).then(r => r.json())
        
        const asset = manifest.assets.find((a: any) => a.id === assetId)
        if (!asset) throw new Error(`Asset ${assetId} not found`)
        
        const variant = format 
          ? asset.variants.find((v: any) => v.format === format)
          : asset.variants[0]
        
        setUrl(variant?.url || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchAsset()
  }, [assetId, format])

  return { url, loading, error }
}

// Usage
export function Logo() {
  const { url, loading } = useAsset('logo-black', 'svg')
  return loading ? <div>Loading...</div> : <img src={url || ''} />
}
```

---

## Fetch Methods

### 1. Direct CDN URLs

**Pros**: Simple, no dependencies, works everywhere  
**Cons**: No caching, no fallback

```html
<img src="https://raw.githubusercontent.com/Sleepy-Studio/branding/main/logos/svg/LogoBlack.svg" />
```

### 2. Fetch Asset Manifest

**Pros**: Get metadata, URLs, formats, sizes  
**Cons**: Extra API call

```bash
curl https://raw.githubusercontent.com/Sleepy-Studio/branding/main/assets.json
```

**Response**:
```json
{
  "assets": [{
    "id": "logo-black",
    "name": "Logo Black",
    "variants": [{
      "format": "svg",
      "url": "https://raw.githubusercontent.com/Sleepy-Studio/branding/main/logos/svg/LogoBlack.svg",
      "size_kb": 10.06
    }]
  }]
}
```

### 3. Asset Service (Recommended)

Create a local service to manage URLs and caching:

```typescript
// services/branding.ts
const MANIFEST_URL = 'https://raw.githubusercontent.com/Sleepy-Studio/branding/main/assets.json'
const CACHE_TTL = 3600 * 1000  // 1 hour

let manifestCache: any = null
let cacheTime = 0

export async function getAssetManifest() {
  if (manifestCache && Date.now() - cacheTime < CACHE_TTL) {
    return manifestCache
  }

  const response = await fetch(MANIFEST_URL)
  manifestCache = await response.json()
  cacheTime = Date.now()
  return manifestCache
}

export async function getAssetUrl(
  assetId: string,
  format?: string
): Promise<string | null> {
  const manifest = await getAssetManifest()
  const asset = manifest.assets.find((a: any) => a.id === assetId)
  
  if (!asset) {
    console.warn(`Asset ${assetId} not found`)
    return null
  }

  const variant = format
    ? asset.variants.find((v: any) => v.format === format)
    : asset.variants[0]

  return variant?.url || null
}

export async function getAsset(assetId: string, format?: string) {
  const url = await getAssetUrl(assetId, format)
  if (!url) return null
  
  const response = await fetch(url)
  return {
    url,
    format: format || 'auto',
    contentType: response.headers.get('content-type'),
    size: response.headers.get('content-length'),
    data: await response.blob()
  }
}
```

---

## Embedding & Display

### SVG Logos

```html
<!-- Inline SVG -->
<svg viewBox="0 0 100 100" width="50" height="50">
  <use xlink:href="https://raw.githubusercontent.com/Sleepy-Studio/branding/main/logos/svg/LogoBlack.svg#logo" />
</svg>

<!-- Favicon -->
<link rel="icon" href="https://raw.githubusercontent.com/Sleepy-Studio/branding/main/logos/svg/LogoBlack.svg" />
```

### PNG & Raster

```html
<!-- Picture element for formats -->
<picture>
  <source srcset="https://.../sleepyyellow.webp" type="image/webp" />
  <source srcset="https://.../sleepyyellow.png" type="image/png" />
  <img src="https://.../sleepyyellow.png" alt="Sleepy" />
</picture>
```

### 3D Models

```html
<!-- Three.js -->
<script type="importmap">
  { "imports": { "three": "https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js" } }
</script>
<script type="module">
  import * as THREE from 'three'
  import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/loaders/GLTFLoader.js'

  const loader = new GLTFLoader()
  loader.load('https://raw.githubusercontent.com/Sleepy-Studio/branding/main/3d-models/glb/SleepyLogo3d.glb', (gltf) => {
    const model = gltf.scene
    // ... add to scene
  })
</script>

<!-- Model Viewer -->
<model-viewer 
  src="https://raw.githubusercontent.com/Sleepy-Studio/branding/main/3d-models/glb/SleepyLogo3d.glb"
  auto-rotate
  camera-controls
  style="width: 400px; height: 400px">
</model-viewer>
```

---

## Platform-Specific Guides

### Next.js / React

```typescript
// next/image (optimized image component)
import Image from 'next/image'

export function Logo() {
  return (
    <Image
      src="https://raw.githubusercontent.com/Sleepy-Studio/branding/main/logos/svg/LogoBlack.svg"
      alt="Logo"
      width={50}
      height={50}
      priority
    />
  )
}
```

### Vue.js

```vue
<template>
  <img 
    :src="logoUrl"
    :alt="logoName"
    class="logo"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const logoUrl = ref('')
const logoName = ref('Logo Black')

onMounted(async () => {
  const manifest = await fetch(
    'https://raw.githubusercontent.com/Sleepy-Studio/branding/main/assets.json'
  ).then(r => r.json())
  
  const logo = manifest.assets.find((a: any) => a.id === 'logo-black')
  logoUrl.value = logo?.variants[0]?.url || ''
})
</script>
```

### Svelte

```svelte
<script>
  let logoUrl = ''

  onMount(async () => {
    const manifest = await fetch(
      'https://raw.githubusercontent.com/Sleepy-Studio/branding/main/assets.json'
    ).then(r => r.json())
    
    const logo = manifest.assets.find(a => a.id === 'logo-black')
    logoUrl = logo?.variants[0]?.url || ''
  })
</script>

<img src={logoUrl} alt="Logo" />
```

### Tailwind CSS

```css
/* Use as background image */
@layer components {
  .logo-bg {
    @apply bg-center bg-no-repeat bg-contain;
    background-image: url('https://raw.githubusercontent.com/Sleepy-Studio/branding/main/logos/svg/LogoBlack.svg');
  }
}
```

### WordPress

```php
<?php
function get_sleepy_logo($asset_id = 'logo-black', $format = 'svg') {
  $manifest_url = 'https://raw.githubusercontent.com/Sleepy-Studio/branding/main/assets.json';
  $manifest = wp_remote_retrieve_body(wp_remote_get($manifest_url));
  $manifest = json_decode($manifest, true);
  
  foreach ($manifest['assets'] as $asset) {
    if ($asset['id'] === $asset_id) {
      foreach ($asset['variants'] as $variant) {
        if ($variant['format'] === $format) {
          return $variant['url'];
        }
      }
    }
  }
  return false;
}
?>

<!-- Usage -->
<img src="<?php echo esc_url(get_sleepy_logo()); ?>" alt="Sleepy Studio" />
```

---

## SDK & Libraries

### Planned SDKs (v2.0+)

```typescript
// @sleepy-studio/branding (npm package)
import { BrandingClient } from '@sleepy-studio/branding'

const branding = new BrandingClient()

// Fetch asset
const logo = await branding.asset('logo-black', { format: 'svg' })
console.log(logo.url)

// List all assets
const assets = await branding.listAssets()

// Generate embed code
const embedCode = await branding.embed('logo-black', { 
  format: 'html',
  style: 'responsive'
})
```

### MCP Server

```typescript
// Cloudflare Worker MCP Server
// Access via Claude, Copilot, or other AI tools
export const brandingServer = {
  tools: {
    'get-asset': async (args) => {
      const url = await getAssetUrl(args.assetId, args.format)
      return { url, markdown: `![Asset](${url})` }
    },
    'list-assets': async () => {
      const manifest = await getAssetManifest()
      return manifest.assets
    }
  }
}
```

---

## Advanced Interoperability

### Webhook-Based Updates

When assets are updated, trigger webhooks to notify dependent repos:

```bash
# Webhook payload
{
  "event": "asset_updated",
  "asset_id": "logo-black",
  "old_variant": { "format": "svg", "url": "...", "size_kb": 10.06 },
  "new_variant": { "format": "svg", "url": "...", "size_kb": 10.50 },
  "timestamp": "2026-08-02T12:00:00Z",
  "migration_url": "https://github.com/Sleepy-Studio/branding/blob/main/MIGRATIONS.md#logo-black-v1-1"
}
```

### Versioning Strategy

```
/logos/svg/LogoBlack.svg         # Latest (v1.x)
/logos/svg/LogoBlack-v1.0.svg    # Pinned version
/logos/svg/LogoBlack-v2.0.svg    # Breaking change
```

### Git Submodule Integration

```bash
# Include branding repo as submodule
git submodule add https://github.com/Sleepy-Studio/branding.git assets/branding

# Use locally
<img src="./assets/branding/logos/svg/LogoBlack.svg" />
```

### Docker / Container Integration

```dockerfile
FROM node:22-alpine

# Copy branding assets during build
COPY --from=branding:latest /assets /public/branding

# Serve at build time or runtime
COPY ./fetch-branding.sh ./
RUN ./fetch-branding.sh
```

---

## Performance & Caching

### Cache Strategy

1. **Browser Cache**: GitHub serves with 1-year cache headers
2. **Service Worker**: Cache in app for offline use
3. **CDN**: Optional (Cloudflare, Vercel, etc.)

```typescript
// Service Worker cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('branding-v1').then((cache) => {
      return cache.addAll([
        'https://raw.githubusercontent.com/Sleepy-Studio/branding/main/logos/svg/LogoBlack.svg',
        'https://raw.githubusercontent.com/Sleepy-Studio/branding/main/assets.json'
      ])
    })
  )
})
```

### Optimization Tips

- ✅ Preload critical assets
- ✅ Use WebP/AVIF when available
- ✅ Cache manifest locally (1 hour TTL)
- ✅ Lazy load non-critical assets
- ✅ Use CDN for high-traffic sites

---

## Troubleshooting

### Asset Not Loading

1. **Verify URL** — Copy URL directly into browser
2. **Check CORS** — GitHub allows CORS from all origins
3. **Inspect headers** — Look for Cache-Control, ETag
4. **Test fallback** — Use png if svg fails

### Manifest Not Found

- Verify URL: `https://raw.githubusercontent.com/Sleepy-Studio/branding/main/assets.json`
- Check branch: Must be `main` (not `develop` or custom branch)
- Check repo access: Branding repo must be public

### Performance Issues

- Cache manifest (1 hour TTL)
- Preload critical assets
- Use service workers for offline
- Consider local mirror for high-volume use

---

## Support

- 💬 **Questions?** [Open an issue](https://github.com/Sleepy-Studio/branding/issues)
- 🚀 **Contribute** — [See CONTRIBUTING.md](CONTRIBUTING.md)
- 📧 **Contact** — brand-team@sleepystudio.xyz

---

**Last Updated**: 2026-08-02  
**Version**: v1.0.0
