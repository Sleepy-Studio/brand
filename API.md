# Branding API & SDK Documentation

**Phase 8: Public Launch & Documentation**

## Overview

The Sleepy Studio Branding API provides programmatic access to all brand assets with built-in caching, versioning, and format negotiation.

- **Base URL**: `https://branding.sleepystudio.xyz`
- **Latest Version**: 1.0.0
- **SDK Packages**: TypeScript/JavaScript, Python, Go (coming soon)

---

## Quick Start

### JavaScript/TypeScript

```bash
npm install @sleepy-studio/branding
```

```typescript
import { BrandingClient } from '@sleepy-studio/branding'

const branding = new BrandingClient()

// Get asset
const logo = await branding.getAsset('logo-black', 'svg')
console.log(logo.url) // https://cdn.sleepystudio.xyz/logos/svg/...

// Search
const results = await branding.search('logo')

// Get all assets
const assets = await branding.getAssets()
```

### React

```bash
npm install @sleepy-studio/branding
```

```jsx
import { useAsset, AssetImage } from '@sleepy-studio/branding/react'

function MyComponent() {
  const { asset, loading } = useAsset('logo-black', 'svg')
  
  return (
    <div>
      <AssetImage assetId="logo-white" format="png" alt="Logo" />
    </div>
  )
}
```

---

## REST API

### Get All Assets

```http
GET /api/v1/assets
```

**Response** (200 OK):
```json
{
  "assets": [
    {
      "id": "logo-black",
      "name": "Black Logo",
      "description": "Primary black logo",
      "added": "2024-01-15",
      "variants": [
        {
          "format": "svg",
          "file": "logos/svg/LogoBlack.svg",
          "size_kb": 12,
          "url": "https://cdn.sleepystudio.xyz/logos/svg/LogoBlack.svg",
          "mime": "image/svg+xml"
        }
      ]
    }
  ]
}
```

**Headers**:
- `Cache-Control: public, max-age=3600`
- `ETag: "33a64df551abcdefg12345"`
- `Last-Modified: Mon, 15 Jan 2024 10:00:00 GMT`

---

### Get Single Asset

```http
GET /api/v1/assets/:id
```

**Example**: `GET /api/v1/assets/logo-black`

**Response** (200 OK):
```json
{
  "id": "logo-black",
  "name": "Black Logo",
  "description": "Primary black logo",
  "added": "2024-01-15",
  "variants": [...]
}
```

---

### Search Assets

```http
GET /api/v1/search?q=query
```

**Query Parameters**:
- `q` (required): Search term (name, description, or ID)
- `format` (optional): Filter by format (svg, png, glb)
- `limit` (optional, default: 20): Max results

**Example**: `GET /api/v1/search?q=logo&format=svg`

**Response** (200 OK):
```json
[
  {
    "id": "logo-black",
    "name": "Black Logo",
    ...
  }
]
```

---

### Get Manifest

```http
GET /assets.json
```

Machine-readable manifest of all assets with metadata.

---

## Webhooks

Subscribe to asset updates to keep your applications synchronized.

### Register Webhook

```bash
curl -X POST https://branding.sleepystudio.xyz/api/v1/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-app.com/webhook",
    "events": ["asset_updated", "asset_created"]
  }'
```

**Response**:
```json
{
  "id": "webhook_12345",
  "secret": "whsec_abcdef123456"
}
```

### Webhook Events

**asset_created**
```json
{
  "event": "asset_created",
  "asset_id": "new-logo",
  "asset_name": "New Logo",
  "timestamp": "2024-01-16T10:30:00Z",
  "changes": {
    "name": "New Logo",
    "description": "A new logo asset"
  },
  "manifestVersion": "1.1.0"
}
```

**asset_updated**
```json
{
  "event": "asset_updated",
  "asset_id": "logo-black",
  "asset_name": "Black Logo",
  "timestamp": "2024-01-16T10:30:00Z",
  "changes": {
    "variants": ["svg", "png"],
    "size_kb": 24
  },
  "manifestVersion": "1.1.0"
}
```

---

## SDKs

### TypeScript/JavaScript

```typescript
import { BrandingClient } from '@sleepy-studio/branding'

const client = new BrandingClient('https://branding.sleepystudio.xyz')

// Get asset
const asset = await client.getAsset('logo-black', 'svg')

// Get all
const assets = await client.getAssets()

// Search
const results = await client.search('logo')

// Get raw manifest
const manifest = await client.getManifest()
```

### React Hooks

```typescript
import { useAsset, useAssets } from '@sleepy-studio/branding/react'

// Single asset
const { asset, loading, error } = useAsset('logo-black', 'svg')

// Multiple assets
const { assets, loading, error } = useAssets()
```

### React Components

```jsx
import { AssetImage } from '@sleepy-studio/branding/react'

<AssetImage assetId="logo-black" format="svg" alt="Logo" />
```

### Vue 3

```typescript
import { useAssetVue } from '@sleepy-studio/branding/vue'

export default {
  setup() {
    const { asset, loading, error } = useAssetVue('logo-black')
    return { asset, loading, error }
  }
}
```

### Svelte

```svelte
<script>
  import { createAssetStore } from '@sleepy-studio/branding/svelte'
  
  const asset = createAssetStore('logo-black')
</script>

{#if $asset.loading}
  Loading...
{:else if $asset.asset}
  <img src={$asset.asset.url} alt="Logo" />
{/if}
```

### Python

```python
from sleepy_branding import BrandingClient

client = BrandingClient()

# Get asset
asset = client.get_asset('logo-black', format='svg')
print(asset['url'])

# Search
results = client.search('logo')

# Get all
assets = client.get_assets()
```

### Go

```go
import "go.sleepystudio.xyz/branding"

client := branding.NewClient()

// Get asset
asset, err := client.GetAsset("logo-black", "svg")
if err != nil {
  panic(err)
}
fmt.Println(asset.URL)

// Search
results, _ := client.Search("logo")
```

---

## Error Handling

### Status Codes

- `200 OK`: Successful request
- `304 Not Modified`: Asset unchanged (ETag match)
- `400 Bad Request`: Invalid parameters
- `404 Not Found`: Asset not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Example Error Response

```json
{
  "error": "Asset not found",
  "code": "ASSET_NOT_FOUND",
  "status": 404,
  "message": "Asset 'logo-black' does not exist"
}
```

---

## Rate Limiting

- **Public**: 1,000 requests/minute per IP
- **Authenticated**: 10,000 requests/minute

Rate limit status in response headers:
- `X-RateLimit-Limit: 1000`
- `X-RateLimit-Remaining: 999`
- `X-RateLimit-Reset: 1234567890`

---

## Versioning

API versioning follows semantic versioning. The current version is `v1`.

Upgrade path for breaking changes:
- `v1` → `v2`: Announced 3 months in advance
- Deprecated endpoints: Available for 6 months after v2 release

---

## Support

- **GitHub Issues**: [Sleepy-Studio/branding/issues](https://github.com/Sleepy-Studio/branding/issues)
- **Email**: support@sleepystudio.xyz
- **Discussions**: [GitHub Discussions](https://github.com/Sleepy-Studio/branding/discussions)
- **Status Page**: [status.sleepystudio.xyz](https://status.sleepystudio.xyz)

---

## Migration Guide

### From Hardcoded URLs

**Before**:
```jsx
<img src="https://github.com/Sleepy-Studio/branding/raw/main/logos/LogoBlack.svg" />
```

**After**:
```jsx
import { AssetImage } from '@sleepy-studio/branding/react'

<AssetImage assetId="logo-black" format="svg" />
```

Benefits:
- ✅ Automatic caching
- ✅ Format negotiation
- ✅ Easy to update (single manifest change)
- ✅ Analytics tracking
- ✅ Webhook notifications

---

## FAQ

**Q: Can I host assets on my own CDN?**
A: Yes, use the `assets.json` manifest and CDN URLs are customizable per deployment.

**Q: How often is the manifest updated?**
A: Within 5 minutes of any asset change.

**Q: Can I use this in production?**
A: Yes, this is production-ready with 99.9% SLA.

**Q: Are there usage limits?**
A: See Rate Limiting section above.

**Q: Can I embed assets directly in my app?**
A: For React, Vue, Svelte: yes, use the framework-specific SDKs. For others: fetch via the REST API.
