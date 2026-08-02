# Sleepy Studio Brand Assets

This repository is the **single source of truth** for all Sleepy Studio brand assets (logos, icons, 3D models, etc.).

## 🎯 Purpose

All Sleepy Studio repositories and services should:
- **Fetch** assets from this repo instead of maintaining local copies
- **Never copy** logos/icons from this repo into other repos
- **Always use** the canonical CDN URLs for serving assets

This ensures:
- ✅ Consistency across all org properties
- ✅ Centralized brand maintenance
- ✅ Reduced redundancy and storage
- ✅ Single point of updates

## 📦 Available Assets

| Asset ID | Name | Formats | Size |
|----------|------|---------|------|
| `logo-black` | Logo Black | SVG | 10 KB |
| `logo-black-red` | Logo Black with Red Accent | SVG | 10 KB |
| `logo-white` | Logo White | SVG | 10 KB |
| `logo-white-red` | Logo White with Red Accent | SVG | 10 KB |
| `sleepy-black` | Sleepy Character - Black | PNG | 16 KB |
| `sleepy-yellow` | Sleepy Character - Yellow | PNG | 53 KB |
| `logo-3d` | Sleepy Logo 3D Model | GLB | 820 KB |

## 🚀 Quick Start

### Option 1: Direct CDN URLs (Simplest)

Use the raw GitHub URLs directly in HTML/CSS:

```html
<!-- Logo -->
<img src="https://raw.githubusercontent.com/Sleepy-Studio/branding/main/LogoBlack.svg" 
     alt="Sleepy Studio" />

<!-- Sleepy Character -->
<img src="https://raw.githubusercontent.com/Sleepy-Studio/branding/main/sleepyyellow.png" 
     alt="Sleepy Character" />

<!-- 3D Model (WebGL viewer) -->
<model-viewer src="https://raw.githubusercontent.com/Sleepy-Studio/branding/main/SleepyLogo3d.glb"
              auto-rotate camera-controls></model-viewer>
```

### Option 2: Asset Manifest API

Fetch the asset manifest to get all variants and metadata:

```bash
curl https://raw.githubusercontent.com/Sleepy-Studio/branding/main/assets.json
```

Returns:
```json
{
  "version": "1.0.0",
  "assets": [
    {
      "id": "logo-black",
      "name": "Logo Black",
      "variants": [
        {
          "format": "svg",
          "url": "https://raw.githubusercontent.com/Sleepy-Studio/branding/main/LogoBlack.svg",
          "size_kb": 10.06
        }
      ]
    }
  ]
}
```

### Option 3: JavaScript/TypeScript Helper

```typescript
// Fetch and cache the asset manifest
async function getAssets() {
  const response = await fetch(
    'https://raw.githubusercontent.com/Sleepy-Studio/branding/main/assets.json'
  )
  return response.json()
}

// Get a specific asset URL
async function getAssetUrl(assetId: string, format: string = 'svg') {
  const manifest = await getAssets()
  const asset = manifest.assets.find((a: any) => a.id === assetId)
  if (!asset) throw new Error(`Asset ${assetId} not found`)
  
  const variant = asset.variants.find((v: any) => v.format === format)
  if (!variant) throw new Error(`Format ${format} not available for ${assetId}`)
  
  return variant.url
}

// Usage
const logoUrl = await getAssetUrl('logo-black', 'svg')
console.log(logoUrl)
```

## 🔧 Integration Example: sitesite

The sitesite (Landing) repo should serve assets by:

1. **Replacing local asset copies** with CDN URLs
2. **Creating an asset service** to manage URLs and fallbacks
3. **Caching the manifest** to avoid repeated API calls

### Step 1: Create Asset Service

```typescript
// src/services/assets.ts
const MANIFEST_URL = 'https://raw.githubusercontent.com/Sleepy-Studio/branding/main/assets.json'

let cachedManifest: any = null

export async function getAssetManifest() {
  if (cachedManifest) return cachedManifest
  
  const response = await fetch(MANIFEST_URL)
  cachedManifest = await response.json()
  return cachedManifest
}

export async function getAssetUrl(assetId: string, format?: string) {
  const manifest = await getAssetManifest()
  const asset = manifest.assets.find((a: any) => a.id === assetId)
  
  if (!asset) {
    console.warn(`Asset ${assetId} not found in branding manifest`)
    return null
  }
  
  const variant = format 
    ? asset.variants.find((v: any) => v.format === format)
    : asset.variants[0]
  
  return variant?.url || null
}
```

### Step 2: Use in Components

```tsx
// src/components/Footer.tsx
import { getAssetUrl } from '#/services/assets'

export default async function Footer() {
  const sleepyYellowUrl = await getAssetUrl('sleepy-yellow', 'png')
  const year = new Date().getFullYear()
  
  return (
    <footer className="site-footer">
      <div className="flex items-center gap-2">
        {sleepyYellowUrl && (
          <img
            src={sleepyYellowUrl}
            alt="Sleepy Studio"
            className="h-4 w-4"
          />
        )}
        <span>&copy; {year} Sleepy Studio. All rights reserved.</span>
      </div>
    </footer>
  )
}
```

### Step 3: Remove Local Asset Copies

```bash
# In sitesite repo, remove these local files:
rm public/sleepyblack.webp
rm public/sleepyyellow.webp
rm public/kng.webp  # if applicable
```

## 🎨 Asset Formats

Currently supported:
- **SVG**: Vector logos (scalable, smallest file size)
- **PNG**: Raster images (transparent background)
- **GLB**: 3D model (GLTF binary format)

### Planned Formats

Future versions will add:
- **WebP**: Modern image format (better compression)
- **AVIF**: Next-gen image format (highest compression)
- **USDZ**: 3D model for iOS AR (in progress)

## 📋 Guidelines

### DO ✅

- ✅ Link/fetch from branding repo URLs
- ✅ Cache the asset manifest locally (1 hour TTL)
- ✅ Use SVG for web (smaller, scalable)
- ✅ Use PNG for fallback/compatibility
- ✅ Report missing formats or assets

### DON'T ❌

- ❌ Copy assets into your repo
- ❌ Manually convert/compress assets (use the official versions)
- ❌ Link to development branches (always use `main`)
- ❌ Create unofficial asset variants
- ❌ Host assets on custom CDNs

## 🚨 Update Notices

When assets change:

1. Update assets in this repo
2. Update `assets.json` manifest
3. Notify other repos (issues/PRs in those repos)
4. Clear caches (1-hour TTL is max)

All repos automatically fetch fresh assets within 1 hour.

## 🔐 Access

This repo is **public for serving assets** but **private for contributions**. Asset updates require:
- PR approval from brand team
- Validation that all formats are correct
- Testing in dependent repos

## 📞 Support

For asset issues or requests:
1. Check [issues](https://github.com/Sleepy-Studio/branding/issues)
2. Create new issue with `[assets]` prefix
3. Tag: `@brand-team`

## Version History

- **v1.0.0** (2026-08-02): Initial asset manifest with SVG, PNG, GLB formats
