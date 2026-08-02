"""
Sleepy Studio Branding SDK for Python
Phase 3: SDK Client Libraries
"""

import json
import requests
from typing import Optional, List, Dict, Any
from functools import lru_cache
from datetime import datetime, timedelta


class Asset:
    def __init__(self, data: Dict[str, Any]):
        self.id = data['id']
        self.name = data['name']
        self.description = data['description']
        self.added = data['added']
        self.variants = data['variants']

    def get_format(self, format_str: str) -> Optional[Dict[str, Any]]:
        for variant in self.variants:
            if variant['format'] == format_str:
                return variant
        return None

    def __repr__(self):
        return f"Asset(id={self.id}, name={self.name})"


class BrandingClient:
    def __init__(self, base_url: str = 'https://branding.sleepystudio.xyz'):
        self.base_url = base_url
        self.session = requests.Session()
        self._manifest_cache = None
        self._cache_time = None
        self.cache_ttl = timedelta(hours=1)

    def get_asset(
        self,
        asset_id: str,
        format_str: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Fetch a single asset by ID and optional format."""
        try:
            response = self.session.get(
                f'{self.base_url}/api/v1/assets/{asset_id}',
                timeout=10
            )
            response.raise_for_status()
            data = response.json()

            if format_str:
                asset = Asset(data)
                variant = asset.get_format(format_str)
                return variant

            return data

        except requests.RequestException as e:
            print(f"Error fetching asset: {e}")
            return None

    def get_assets(self) -> List[Asset]:
        """Fetch all assets."""
        try:
            manifest = self.get_manifest()
            return [Asset(a) for a in manifest.get('assets', [])]
        except Exception as e:
            print(f"Error fetching assets: {e}")
            return []

    def search(
        self,
        query: str,
        format_str: Optional[str] = None,
        limit: int = 20
    ) -> List[Asset]:
        """Search assets by name, description, or ID."""
        try:
            params = {
                'q': query,
                'limit': limit
            }
            if format_str:
                params['format'] = format_str

            response = self.session.get(
                f'{self.base_url}/api/v1/search',
                params=params,
                timeout=10
            )
            response.raise_for_status()
            data = response.json()

            return [Asset(a) for a in data]

        except requests.RequestException as e:
            print(f"Error searching assets: {e}")
            return []

    def get_manifest(self) -> Dict[str, Any]:
        """Fetch the manifest with caching."""
        now = datetime.now()

        # Check cache
        if (self._manifest_cache and self._cache_time and
                now - self._cache_time < self.cache_ttl):
            return self._manifest_cache

        try:
            response = self.session.get(
                f'{self.base_url}/assets.json',
                timeout=10
            )
            response.raise_for_status()
            self._manifest_cache = response.json()
            self._cache_time = now
            return self._manifest_cache

        except requests.RequestException as e:
            print(f"Error fetching manifest: {e}")
            return {'assets': []}

    def clear_cache(self):
        """Clear cached manifest."""
        self._manifest_cache = None
        self._cache_time = None

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.session.close()


# CLI helper
def main():
    import argparse

    parser = argparse.ArgumentParser(description='Sleepy Studio Branding CLI')
    subparsers = parser.add_subparsers(dest='command', help='Commands')

    # Get asset
    get_parser = subparsers.add_parser('get', help='Get asset')
    get_parser.add_argument('asset_id', help='Asset ID')
    get_parser.add_argument('--format', help='Format (svg, png, glb)')

    # List all
    subparsers.add_parser('list', help='List all assets')

    # Search
    search_parser = subparsers.add_parser('search', help='Search assets')
    search_parser.add_argument('query', help='Search query')

    args = parser.parse_args()

    client = BrandingClient()

    if args.command == 'get':
        asset = client.get_asset(args.asset_id, args.format)
        if asset:
            print(json.dumps(asset, indent=2))
        else:
            print(f"Asset '{args.asset_id}' not found")

    elif args.command == 'list':
        assets = client.get_assets()
        for asset in assets:
            print(f"  • {asset.id}: {asset.name}")

    elif args.command == 'search':
        results = client.search(args.query)
        for asset in results:
            print(f"  • {asset.id}: {asset.name}")

    else:
        parser.print_help()


if __name__ == '__main__':
    main()
