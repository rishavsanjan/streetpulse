"use client";

import {
  AdvancedMarker,
  Map,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import type { SelectedLocation } from "./types";

interface GoogleMapProps {
  location: SelectedLocation;
  onLocationChange: (location: SelectedLocation) => void;
}

function MapController({ location }: { location: SelectedLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    map.panTo({
      lat: location.latitude,
      lng: location.longitude,
    });
  }, [map, location]);

  return null;
}

export default function GoogleMap({
  location,
  onLocationChange,
}: GoogleMapProps) {
  return (
    <>
      <MapController location={location} />

      <Map
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        defaultZoom={15}
        center={{
          lat: location.latitude,
          lng: location.longitude,
        }}
        gestureHandling="greedy"
        disableDefaultUI={false}
        style={{
          width: "100%",
          height: "450px",
          borderRadius: "12px",
        }}
        onClick={(event) => {
          if (!event.detail.latLng) return;

          onLocationChange({
            ...location,
            latitude: event.detail.latLng.lat,
            longitude: event.detail.latLng.lng,
          });
        }}
      >
        <AdvancedMarker
          position={{
            lat: location.latitude,
            lng: location.longitude,
          }}
          draggable
          onDragEnd={(event) => {
            if (!event.latLng) return;

            onLocationChange({
              ...location,
              latitude: event.latLng.lat,
              longitude: event.latLng.lng,
            });
          }}
        >
          <Pin
            background="#16a34a"
            borderColor="#166534"
            glyphColor="#fff"
          />
        </AdvancedMarker>
      </Map>
    </>
  );
}