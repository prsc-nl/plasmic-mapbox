# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

plasmic-google-maps is a Plasmic code component library that wraps `@vis.gl/react-google-maps` to provide a `GoogleMap` and `MapPin` component pair for use in Plasmic Studio.

## Commands

- `bun install` — install dependencies
- `bun run build` — compile TypeScript to `dist/` (runs `tsc`)

## Architecture

Single-file library (`src/index.tsx`) exporting one registration function `registerGoogleMap()` that registers two components with a Plasmic loader:

- **GoogleMap** — parent component wrapping `APIProvider` + `Map`. Accepts Google Maps API key, map ID, center coordinates, zoom, and control toggles.
- **MapPin** — child component (must be nested inside GoogleMap) wrapping `AdvancedMarker`. Accepts lat/lng, z-index, and a slot for custom pin content.

The package is published as ESM only (`"type": "module"`), outputting to `dist/` with declarations.

## Development Notes

- Default to **Bun** for all tooling (not Node/npm).
- React 18 and TypeScript 5 are peer dependencies — not bundled.
- `@plasmicapp/loader-react` is a dev dependency only (consumers provide it).
- TypeScript strict mode is enabled with `noUncheckedIndexedAccess` and `verbatimModuleSyntax`.
