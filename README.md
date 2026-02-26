# plasmic-mapbox

Plasmic code components for embedding Mapbox GL maps with custom markers. Built on [`react-map-gl`](https://github.com/visgl/react-map-gl).

## Installation

```bash
npm install plasmic-mapbox
```

### Peer dependencies

- `react` ^18
- `typescript` ^5

## Components

### MapboxMap

A full-featured Mapbox GL map container with configurable center, zoom, and style.

| Prop           | Type      | Default                                  | Description                            |
| -------------- | --------- | ---------------------------------------- | -------------------------------------- |
| `accessToken`  | `string`  | env var                                  | Mapbox access token (see below)        |
| `mapStyle`     | `string`  | `mapbox://styles/mapbox/streets-v12`     | Mapbox style URL                       |
| `centerLat`    | `number`  | `51.9225`                                | Latitude of the map center             |
| `centerLng`    | `number`  | `4.47917`                                | Longitude of the map center            |
| `zoom`         | `number`  | `12`                                     | Zoom level (1–20)                      |
| `showControls` | `boolean` | `true`                                   | Show attribution controls              |
| `scrollZoom`   | `boolean` | `true`                                   | Enable scroll wheel zooming            |
| `children`     | `node`    | —                                        | `MapPin` components to render on the map |

### MapPin

A marker that renders inside a `MapboxMap`. Supports fully custom content via its children slot.

| Prop       | Type     | Default | Description                             |
| ---------- | -------- | ------- | --------------------------------------- |
| `lat`      | `number` | —       | Latitude (required)                     |
| `lng`      | `number` | —       | Longitude (required)                    |
| `children` | `node`   | —       | Custom pin content (labels, icons, etc) |

## Usage with Plasmic

Register the components with your Plasmic loader:

```tsx
import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import { registerMapboxMap } from "plasmic-mapbox";

const PLASMIC = initPlasmicLoader({ ... });

registerMapboxMap(PLASMIC);
```

Once registered, **Mapbox Map** and **Map Pin** will appear in the Plasmic Studio insert menu. Configure the access token and map settings directly from the Studio props panel.

## Standalone usage

The components can also be used directly in React without Plasmic:

```tsx
import { MapboxMap, MapPin } from "plasmic-mapbox";

function App() {
  return (
    <MapboxMap accessToken="YOUR_MAPBOX_TOKEN" zoom={14}>
      <MapPin lat={52.3676} lng={4.9041}>
        <span>Amsterdam</span>
      </MapPin>
      <MapPin lat={51.9225} lng={4.4792}>
        <span>Rotterdam</span>
      </MapPin>
    </MapboxMap>
  );
}
```

## Access token

The component looks for a Mapbox token in this order:

1. `NEXT_PUBLIC_MAPBOX_TOKEN` environment variable
2. `MAPBOX_TOKEN` environment variable
3. The `accessToken` prop

Set the token in your `.env` file to override any prop value:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
```

Get your token from the [Mapbox access tokens page](https://docs.mapbox.com/help/getting-started/access-tokens/).

## License

MIT
