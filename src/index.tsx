import { useState, useCallback, useMemo, useEffect } from "react";
import type React from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import type { PlasmicComponentLoader } from "@plasmicapp/loader-react";

const MAPBOX_CSS = "https://api.mapbox.com/mapbox-gl-js/v3.11.0/mapbox-gl.css";
const CSS_ID = "__plasmic-mapbox-css";

function useMapboxCSS() {
  useEffect(() => {
    if (document.getElementById(CSS_ID)) return;
    const link = document.createElement("link");
    link.id = CSS_ID;
    link.rel = "stylesheet";
    link.href = MAPBOX_CSS;
    document.head.appendChild(link);
  }, []);
}

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
  children?: React.ReactNode;
  className?: string;
}

export const MapPin: React.FC<MapPinProps> = ({
  lat,
  lng,
  children,
  className,
}) => {
  return (
    <Marker longitude={lng} latitude={lat}>
      <div className={className}>{children}</div>
    </Marker>
  );
};

/* ─── MapboxMap (parent component) ─── */

export interface MapboxMapProps {
  accessToken: string;
  styleType?: "link" | "custom";
  mapStyle?: string;
  customStyle?: string;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  children?: React.ReactNode;
  showControls?: boolean;
  scrollZoom?: boolean;
  className?: string;
}

export const MapboxMap: React.FC<MapboxMapProps> = ({
  accessToken: accessTokenProp,
  styleType = "link",
  mapStyle = "mapbox://styles/mapbox/streets-v12",
  customStyle,
  centerLat = 51.9225,
  centerLng = 4.47917,
  zoom = 12,
  children,
  showControls = true,
  scrollZoom = true,
  className,
}) => {
  const accessToken =
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.MAPBOX_TOKEN ||
    accessTokenProp ||
    "";
  useMapboxCSS();
  const resolvedStyle = useMemo(() => {
    if (styleType === "custom" && customStyle) {
      try {
        return JSON.parse(customStyle);
      } catch {
        return mapStyle;
      }
    }
    return mapStyle;
  }, [styleType, mapStyle, customStyle]);
  const [viewState, setViewState] = useState({
    longitude: centerLng,
    latitude: centerLat,
    zoom,
  });

  const onMove = useCallback(
    (evt: { viewState: typeof viewState }) => setViewState(evt.viewState),
    [],
  );

  return (
    <div className={className}>
      <Map
        {...viewState}
        onMove={onMove}
        mapboxAccessToken={accessToken}
        mapStyle={resolvedStyle}
        style={{ width: "100%", height: "100%" }}
        attributionControl={showControls}
        scrollZoom={scrollZoom}
      >
        {showControls && <NavigationControl />}
        {children}
      </Map>
    </div>
  );
};

/* ─── Plasmic Registration ─── */

export function registerMapboxMap(loader: PlasmicComponentLoader) {
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
    importPath: "./components/MapboxMap",
  });

  loader.registerComponent(MapPin, {
    name: "MapPin",
    displayName: "Map Pin",
    description: "A marker pin to place inside a Mapbox Map",
    parentComponentName: "MapboxMap",
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
    importPath: "./components/MapboxMap",
  });

  loader.registerComponent(MapboxMap, {
    name: "MapboxMap",
    displayName: "Mapbox Map",
    description: "Mapbox GL map component with custom markers",
    props: {
      accessToken: {
        type: "string",
        displayName: "Access Token",
        description: "Mapbox access token",
        defaultValue: "",
      },
      styleType: {
        type: "choice",
        displayName: "Style Type",
        description: "Use a Mapbox style URL or custom style JSON",
        options: ["link", "custom"],
        defaultValue: "link",
      },
      mapStyle: {
        type: "string",
        displayName: "Style URL",
        description:
          "Mapbox style URL (e.g. mapbox://styles/mapbox/streets-v12)",
        defaultValue: "mapbox://styles/mapbox/streets-v12",
        hidden: (props: MapboxMapProps) => props.styleType === "custom",
      },
      customStyle: {
        type: "code",
        lang: "json",
        displayName: "Custom Style JSON",
        description: "Mapbox style specification as JSON",
        hidden: (props: MapboxMapProps) => props.styleType !== "custom",
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
        description: "Show map attribution controls",
        defaultValue: true,
      },
      scrollZoom: {
        type: "boolean",
        displayName: "Scroll Zoom",
        description: "Enable zooming with scroll wheel",
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
    importPath: "./components/MapboxMap",
  });
}
