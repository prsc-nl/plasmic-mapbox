# plasmic-google-maps

Plasmic code components for embedding Google Maps with custom markers. Built on [`@vis.gl/react-google-maps`](https://github.com/visgl/react-google-maps).

## Installation

```bash
npm install plasmic-google-maps
```

### Peer dependencies

- `react` ^18
- `typescript` ^5

## Components

### GoogleMap

A full-featured Google Maps container with configurable center, zoom, and UI controls.

| Prop           | Type      | Default   | Description                                      |
| -------------- | --------- | --------- | ------------------------------------------------ |
| `apiKey`       | `string`  | —         | Google Maps API key (required)                    |
| `mapId`        | `string`  | —         | Google Maps Map ID (required for custom markers)  |
| `centerLat`    | `number`  | `51.9225` | Latitude of the map center                        |
| `centerLng`    | `number`  | `4.47917` | Longitude of the map center                       |
| `zoom`         | `number`  | `12`      | Zoom level (1–20)                                 |
| `showControls` | `boolean` | `true`    | Show zoom, street view, and fullscreen controls   |
| `children`     | `node`    | —         | `MapPin` components to render on the map          |

### MapPin

An advanced marker that renders inside a `GoogleMap`. Supports fully custom content via its children slot.

| Prop       | Type     | Default | Description                             |
| ---------- | -------- | ------- | --------------------------------------- |
| `lat`      | `number` | —       | Latitude (required)                     |
| `lng`      | `number` | —       | Longitude (required)                    |
| `zIndex`   | `number` | auto    | Stacking order (defaults to latitude)   |
| `children` | `node`   | —       | Custom pin content (labels, icons, etc) |

## Usage with Plasmic

Register the components with your Plasmic loader:

```tsx
import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import { registerGoogleMap } from "plasmic-google-maps";

const PLASMIC = initPlasmicLoader({ ... });

registerGoogleMap(PLASMIC);
```

Once registered, **Google Map** and **Map Pin** will appear in the Plasmic Studio insert menu. Configure API key and map settings directly from the Studio props panel.

## Standalone usage

The components can also be used directly in React without Plasmic:

```tsx
import { GoogleMap, MapPin } from "plasmic-google-maps";

function App() {
  return (
    <GoogleMap apiKey="YOUR_API_KEY" mapId="YOUR_MAP_ID" zoom={14}>
      <MapPin lat={52.3676} lng={4.9041}>
        <span>Amsterdam</span>
      </MapPin>
      <MapPin lat={51.9225} lng={4.4792}>
        <span>Rotterdam</span>
      </MapPin>
    </GoogleMap>
  );
}
```

## Prerequisites

- A [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) with the Maps JavaScript API enabled
- A [Map ID](https://developers.google.com/maps/documentation/get-map-id) (required for `AdvancedMarker` / custom pin content)

## License

MIT
