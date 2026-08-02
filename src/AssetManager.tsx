import React, { useState, useEffect } from 'react'

/**
 * Phase 6: Asset Manager UI
 * Web interface for uploading, managing, and previewing assets
 */

interface Asset {
  id: string
  name: string
  description: string
  added: string
  variants: any[]
}

export function AssetManager() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchAssets()
  }, [])

  async function fetchAssets() {
    try {
      const response = await fetch('/api/v1/assets')
      const data = await response.json()
      setAssets(data)
    } catch (error) {
      console.error('Failed to load assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = assets.filter(a =>
    a.name.toLowerCase().includes(filter.toLowerCase()) ||
    a.id.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="asset-manager">
      <header className="manager-header">
        <h1>Sleepy Studio Brand Assets</h1>
        <button onClick={() => window.location.href = '/upload'} className="btn-primary">
          Upload Asset
        </button>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search assets..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Loading assets...</div>
      ) : (
        <div className="asset-grid">
          {filtered.map(asset => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  )
}

function AssetCard({ asset }: { asset: Asset }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="asset-card">
      <div className="asset-preview">
        {asset.variants[0] && (
          <img
            src={asset.variants[0].url}
            alt={asset.name}
            onClick={() => setExpanded(!expanded)}
          />
        )}
      </div>

      <div className="asset-info">
        <h3>{asset.name}</h3>
        <p className="asset-id">{asset.id}</p>
        <p className="asset-description">{asset.description}</p>
        <div className="asset-meta">
          <span className="added-date">Added: {asset.added}</span>
          <span className="format-count">{asset.variants.length} formats</span>
        </div>

        {expanded && (
          <div className="asset-details">
            <h4>Available Formats</h4>
            <ul>
              {asset.variants.map((v, i) => (
                <li key={i}>
                  <code>{v.format}</code>
                  <span className="size">{v.size_kb}KB</span>
                  <a href={v.url} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export function AssetUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState({
    id: '',
    name: '',
    description: ''
  })
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('metadata', JSON.stringify(metadata))

    try {
      const response = await fetch('/api/v1/assets/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setMessage('Asset uploaded successfully!')
        setFile(null)
        setMetadata({ id: '', name: '', description: '' })
      } else {
        setMessage('Upload failed: ' + response.statusText)
      }
    } catch (error: any) {
      setMessage('Error: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="upload-container">
      <h2>Upload New Asset</h2>
      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label>Asset ID (e.g., logo-black)</label>
          <input
            type="text"
            value={metadata.id}
            onChange={(e) => setMetadata({ ...metadata, id: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={metadata.name}
            onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={metadata.description}
            onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  )
}

export function AssetAnalytics() {
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalDownloads: 0,
    topAssets: []
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      const response = await fetch('/api/v1/analytics')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
  }

  return (
    <div className="analytics-dashboard">
      <h2>Asset Analytics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Assets</h3>
          <p className="stat-value">{stats.totalAssets}</p>
        </div>

        <div className="stat-card">
          <h3>Total Downloads</h3>
          <p className="stat-value">{stats.totalDownloads}</p>
        </div>
      </div>

      <div className="top-assets">
        <h3>Top Assets</h3>
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Downloads</th>
            </tr>
          </thead>
          <tbody>
            {stats.topAssets.map((asset: any) => (
              <tr key={asset.id}>
                <td>{asset.name}</td>
                <td>{asset.downloads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
