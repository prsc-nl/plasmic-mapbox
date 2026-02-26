import type React from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import type { PlasmicComponentLoader } from "@plasmicapp/loader-react";

/* ─── MapBubble (speech-bubble label) ─── */

export interface MapBubbleProps {
  background?: string;
  color?: string;
  borderRadius?: number;
  arrowSize?: number;
  children?: React.ReactNode;
  className?: string;
}

export const MapBubble: React.FC<MapBubbleProps> = ({
  background = "#333",
  color = "#fff",
  borderRadius = 4,
  arrowSize = 6,
  children,
  className,
}) => {
  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          background,
          color,
          padding: "4px 8px",
          borderRadius,
          whiteSpace: "nowrap",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        {children}
      </div>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid ${background}`,
        }}
      />
    </div>
  );
};

/* ─── MapPin (child component) ─── */

export interface MapPinProps {
  lat: number;
  lng: number;
  zIndex?: number;
  className?: string;
  children?: React.ReactNode;
}

export const MapPin: React.FC<MapPinProps> = ({
  lat,
  lng,
  zIndex,
  className,
  children,
}) => {
  const defaultZIndex = 90 - lat;
  return (
    <AdvancedMarker
      position={{ lat, lng }}
      zIndex={zIndex ?? defaultZIndex}
      className={className}
    >
      {children}
    </AdvancedMarker>
  );
};

/* ─── GoogleMap (parent component) ─── */

export interface GoogleMapProps {
  apiKey: string;
  mapId?: string;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  children?: React.ReactNode;
  showControls?: boolean;
  className?: string;
}

export const GoogleMap: React.FC<GoogleMapProps> = ({
  apiKey,
  mapId,
  centerLat = 51.9225,
  centerLng = 4.47917,
  zoom = 12,
  children,
  showControls = true,
  className,
}) => {
  return (
    <APIProvider apiKey={apiKey}>
      <Map
        className={className}
        defaultCenter={{ lat: centerLat, lng: centerLng }}
        defaultZoom={zoom}
        mapId={mapId}
        disableDefaultUI={!showControls}
        zoomControl={showControls}
        streetViewControl={showControls}
        mapTypeControl={false}
        fullscreenControl={showControls}
      >
        {children}
      </Map>
    </APIProvider>
  );
};

/* ─── Plasmic Registration ─── */

export function registerGoogleMap(loader: PlasmicComponentLoader) {
  loader.registerComponent(MapBubble, {
    name: "MapBubble",
    displayName: "Map Bubble",
    description: "A speech-bubble label with an arrow pointer",
    props: {
      background: {
        type: "color",
        displayName: "Background",
        defaultValue: "#333",
      },
      color: {
        type: "color",
        displayName: "Text Color",
        defaultValue: "#fff",
      },
      borderRadius: {
        type: "number",
        displayName: "Border Radius",
        defaultValue: 4,
      },
      arrowSize: {
        type: "number",
        displayName: "Arrow Size",
        defaultValue: 6,
      },
      children: {
        type: "slot",
        displayName: "Content",
        defaultValue: [
          {
            type: "text",
            value: "Label",
          },
        ],
      },
    },
    importPath: "./components/GoogleMap",
  });

  loader.registerComponent(MapPin, {
    name: "MapPin",
    displayName: "Map Pin",
    description: "A marker pin to place inside a Google Map",
    parentComponentName: "GoogleMap",
    defaultStyles: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    props: {
      lat: {
        type: "number",
        displayName: "Latitude",
        defaultValue: 51.9225,
      },
      lng: {
        type: "number",
        displayName: "Longitude",
        defaultValue: 4.47917,
      },
      zIndex: {
        type: "number",
        displayName: "Z-Index",
        description: "Stacking order of the pin",
      },
      children: {
        type: "slot",
        displayName: "Content",
        defaultValue: [
          {
            type: "component",
            name: "MapBubble",
          },
        ],
      },
    },
    importPath: "./components/GoogleMap",
  });

  loader.registerComponent(GoogleMap, {
    name: "GoogleMap",
    displayName: "Google Map",
    description: "Google Maps component with custom styling",
    props: {
      apiKey: {
        type: "string",
        displayName: "API Key",
        description: "Google Maps API key",
        defaultValue: "",
      },
      mapId: {
        type: "string",
        displayName: "Map ID",
        description: "Google Maps Map ID (required for custom markers)",
        defaultValue: "",
      },
      centerLat: {
        type: "number",
        displayName: "Center Latitude",
        description: "Latitude of the map center",
        defaultValue: 51.9225,
      },
      centerLng: {
        type: "number",
        displayName: "Center Longitude",
        description: "Longitude of the map center",
        defaultValue: 4.47917,
      },
      zoom: {
        type: "number",
        displayName: "Zoom Level",
        description: "Map zoom level (1-20)",
        defaultValue: 12,
      },
      showControls: {
        type: "boolean",
        displayName: "Show Controls",
        description: "Show map controls (zoom, street view, fullscreen)",
        defaultValue: true,
      },
      children: {
        type: "slot",
        displayName: "Pins",
        description: "Map Pin markers to display on the map",
        allowedComponents: ["MapPin"],
        defaultValue: [
          {
            type: "component",
            name: "MapPin",
            props: {
              lat: 51.9225,
              lng: 4.47917,
            },
            styles: {
              alignItems: "center",
            },
          },
        ],
      },
    },
    importPath: "./components/GoogleMap",
  });
}
