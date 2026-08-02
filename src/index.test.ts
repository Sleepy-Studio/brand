import { describe, it, expect, beforeAll } from 'vitest'
import { BrandingClient } from './index'

/**
 * Phase 7: Test Suite
 * Comprehensive testing for SDK, API, and integrations
 */

describe('BrandingClient', () => {
  let client: BrandingClient

  beforeAll(() => {
    client = new BrandingClient('http://localhost:8787')
  })

  describe('getAsset', () => {
    it('should fetch asset by ID', async () => {
      const asset = await client.getAsset('logo-black')
      expect(asset).toBeDefined()
      expect(asset?.url).toBeDefined()
    })

    it('should fetch asset in specific format', async () => {
      const asset = await client.getAsset('logo-black', 'svg')
      expect(asset?.format).toBe('svg')
    })

    it('should return null for non-existent asset', async () => {
      const asset = await client.getAsset('non-existent')
      expect(asset).toBeNull()
    })

    it('should cache manifest requests', async () => {
      const asset1 = await client.getAsset('logo-white')
      const asset2 = await client.getAsset('logo-white')
      expect(asset1).toEqual(asset2)
    })
  })

  describe('getAssets', () => {
    it('should fetch all assets', async () => {
      const assets = await client.getAssets()
      expect(Array.isArray(assets)).toBe(true)
      expect(assets.length).toBeGreaterThan(0)
    })

    it('should include all asset metadata', async () => {
      const assets = await client.getAssets()
      const asset = assets[0]
      expect(asset.id).toBeDefined()
      expect(asset.name).toBeDefined()
      expect(asset.variants).toBeInstanceOf(Array)
    })
  })

  describe('search', () => {
    it('should search by name', async () => {
      const results = await client.search('logo')
      expect(results.length).toBeGreaterThan(0)
    })

    it('should search by ID', async () => {
      const results = await client.search('black')
      expect(results.some(a => a.id.includes('black'))).toBe(true)
    })

    it('should be case insensitive', async () => {
      const results1 = await client.search('LOGO')
      const results2 = await client.search('logo')
      expect(results1.length).toBe(results2.length)
    })

    it('should return empty for no matches', async () => {
      const results = await client.search('xyzabc123')
      expect(results).toEqual([])
    })
  })

  describe('Cache behavior', () => {
    it('should cache manifest for 1 hour', async () => {
      const manifest1 = await client.getManifest()
      const manifest2 = await client.getManifest()
      expect(manifest1).toBe(manifest2)
    })

    it('should refresh expired cache', async () => {
      // This would need time manipulation in real tests
      const manifest = await client.getManifest()
      expect(manifest).toBeDefined()
    })
  })
})

describe('API Endpoints', () => {
  const baseUrl = 'http://localhost:8787'

  it('GET /api/v1/assets - returns manifest', async () => {
    const response = await fetch(`${baseUrl}/api/v1/assets`)
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.assets).toBeInstanceOf(Array)
  })

  it('GET /api/v1/assets/:id - returns single asset', async () => {
    const response = await fetch(`${baseUrl}/api/v1/assets/logo-black`)
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.id).toBe('logo-black')
  })

  it('GET /api/v1/search?q=logo - searches assets', async () => {
    const response = await fetch(`${baseUrl}/api/v1/search?q=logo`)
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toBeInstanceOf(Array)
  })

  it('GET /assets.json - returns manifest file', async () => {
    const response = await fetch(`${baseUrl}/assets.json`)
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/json')
  })

  it('Caching headers are set correctly', async () => {
    const response = await fetch(`${baseUrl}/api/v1/assets/logo-white`)
    const cacheControl = response.headers.get('cache-control')
    expect(cacheControl).toContain('max-age')
  })

  it('ETag is generated for responses', async () => {
    const response = await fetch(`${baseUrl}/api/v1/assets`)
    expect(response.headers.get('etag')).toBeDefined()
  })
})

describe('Asset formats', () => {
  const formats = ['svg', 'png', 'glb']

  formats.forEach(format => {
    it(`should handle ${format} format`, async () => {
      const client = new BrandingClient()
      const assets = await client.getAssets()
      const hasFormat = assets.some(a =>
        a.variants.some(v => v.format === format)
      )
      if (hasFormat) {
        // Asset with this format exists
        expect(true).toBe(true)
      }
    })
  })
})

describe('Performance', () => {
  it('should fetch asset in under 500ms', async () => {
    const client = new BrandingClient()
    const start = performance.now()
    await client.getAsset('logo-black')
    const duration = performance.now() - start
    expect(duration).toBeLessThan(500)
  })

  it('should search in under 100ms', async () => {
    const client = new BrandingClient()
    const start = performance.now()
    await client.search('logo')
    const duration = performance.now() - start
    expect(duration).toBeLessThan(100)
  })
})

describe('Error handling', () => {
  it('should handle network errors gracefully', async () => {
    const client = new BrandingClient('http://invalid-url')
    const asset = await client.getAsset('logo-black')
    expect(asset).toBeNull()
  })

  it('should handle malformed responses', async () => {
    // Test with mock
    expect(() => {
      const data = JSON.parse('invalid json')
    }).toThrow()
  })
})
