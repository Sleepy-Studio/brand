# Stack and Structure

## Canonical frontend stack

The current Sleepy Studio landing implementation uses:

- Node.js 22 or newer
- pnpm
- React 19
- Vite 8
- TypeScript
- TanStack Router
- TanStack Query where server-state caching is needed
- Tailwind CSS 4 through the Vite plugin
- Vitest for tests
- Lucide React for general icons
- Three.js, React Three Fiber, and Drei only where 3D is justified

## Recommended project structure

```text
src/
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── feedback/
│   └── domain/
├── config/
├── hooks/
├── routes/
├── services/
│   └── branding.ts
├── styles.css
└── main.tsx
```

## Structural rules

1. Use file-based TanStack Router routes.
2. Keep global layout in the root route.
3. Keep visual primitives in shared components.
4. Keep project-specific behavior in domain components.
5. Keep branding asset URLs behind a service module.
6. Avoid hardcoded organization asset URLs inside components.
7. Treat 3D, animation characters, and media-heavy effects as optional layers rather than baseline requirements.
8. Prefer browser-native features before introducing additional dependencies.

## Root route expectations

The root route should own:

- document metadata
- favicon
- global header
- route outlet
- persistent organization-level UI
- optional character or floating brand elements

## Build and runtime

Default development:

```bash
pnpm install
pnpm dev
```

Default production build:

```bash
pnpm build
```

A project may use a static host, Cloudflare, or a minimal Node server. Runtime choices should be driven by the product's backend needs, not copied automatically from the landing repository.
