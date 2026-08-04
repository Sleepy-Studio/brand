# Component Patterns

## Header

Expected characteristics:

- sticky glass surface
- organization mark aligned left
- compact action group centered or right-aligned
- icon controls with accessible labels
- no oversized navigation bar
- actions are icon-only buttons (no text links); nav is minimal, labeled via
  `aria-label`/`title` rather than visible text

## Cards

Base card states:

- normal
- hover
- featured
- disabled or placeholder

Featured cards may use a slightly brighter border and restrained warm glow. Disabled cards should not animate on hover.

## Buttons

Recommended variants:

- default
- primary black
- icon-only
- external-service contextual hover
- disabled

Every icon-only button must include an accessible name.

## Inputs

Inputs use:

- elevated translucent background
- subtle border
- 12px radius
- muted placeholders
- a low-intensity white focus ring

## Floating organization mark

A small fixed organization mark can be used as an optional cross-project signature. It should not overlap core navigation, mobile controls, or persistent media controls.

## Domain components

Projects should build domain-specific components using the same primitives. For SleepyRadio, these include:

- station card
- compact station row
- persistent player
- sleep timer panel
- search and filters
- playback error notice
- favorite control

## Component ownership

The site kit defines visual and interaction contracts. It should not own project data fetching, routing, or business behavior.
