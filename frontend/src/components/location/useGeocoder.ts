"use client";

import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default function useGeocoder() {
  const geocoding = useMapsLibrary("geocoding");

  async function reverseGeocode(lat: number, lng: number) {
    if (!geocoding) return "";

    const geocoder = new geocoding.Geocoder();

    const { results } = await geocoder.geocode({
      location: {
        lat,
        lng,
      },
    });

    return results?.[0]?.formatted_address ?? "";
  }

  return reverseGeocode;
}