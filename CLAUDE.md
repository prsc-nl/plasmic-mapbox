# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

plasmic-mapbox is a Plasmic code component library that wraps `react-map-gl` (Mapbox GL JS) to provide a `MapboxMap` and `MapPin` component pair for use in Plasmic Studio.

## Commands

- `bun install` — install dependencies
- `bun run build` — compile TypeScript to `dist/` (runs `tsc`)

## Architecture

Single-file library (`src/index.tsx`) exporting one registration function `registerMapboxMap()` that registers three components with a Plasmic loader:

- **MapboxMap** — parent component wrapping `react-map-gl` Map. Accepts Mapbox access token, map style, center coordinates, zoom, and control toggles.
- **MapPin** — child component (must be nested inside MapboxMap) wrapping `Marker`. Accepts lat/lng and a slot for custom pin content.
- **MapBubble** — decorative speech-bubble label used as default MapPin content.

The package is published as ESM only (`"type": "module"`), outputting to `dist/` with declarations.

## Development Notes

- Default to **Bun** for all tooling (not Node/npm).
- React 18 and TypeScript 5 are peer dependencies — not bundled.
- `@plasmicapp/loader-react` is a dev dependency only (consumers provide it).
- TypeScript strict mode is enabled with `noUncheckedIndexedAccess` and `verbatimModuleSyntax`.
