"use client";

import { useCallback, useEffect } from "react";

import CurrentLocation from "./CurrentLocation";
import GoogleMap from "./GoogleMap";
import SelectedLocationCard from "./SelectedLocationCard";
import type { SelectedLocation } from "./types";
import useGeocoder from "./useGeocoder";

interface LocationPickerProps {
  value: SelectedLocation;
  onChange: (location: SelectedLocation) => void;
}

export default function LocationPicker({
  value,
  onChange,
}: LocationPickerProps) {
  const reverseGeocode = useGeocoder();

  const handleLocationChange = useCallback(
    async (location: SelectedLocation) => {
      // SearchPlace already provides an address
      if (location.address) {
        onChange(location);
        return;
      }

      try {
        const address = await reverseGeocode(
          location.latitude,
          location.longitude
        );

        onChange({
          ...location,
          address,
        });
      } catch (error) {
        console.error("Reverse geocoding failed:", error);

        onChange(location);
      }
    },
    [onChange, reverseGeocode]
  );

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div className="space-y-5">


      <GoogleMap
        location={value}
        onLocationChange={handleLocationChange}
      />

      <SelectedLocationCard location={value} />
    </div>
  );
}