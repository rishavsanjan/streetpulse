"use client";

import { LocateFixed } from "lucide-react";
import { useState } from "react";
import type { SelectedLocation } from "./types";

interface CurrentLocationProps {
  onLocationChange: (location: SelectedLocation) => void;
}

export default function CurrentLocation({
  onLocationChange,
}: CurrentLocationProps) {
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onLocationChange({
          address: "",
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        setLoading(false);
      },
      (error) => {
        console.error(error);

        let message = "Unable to fetch your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location permission denied.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }

        alert(message);

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <button
      type="button"
      onClick={getCurrentLocation}
      disabled={loading}
      className="w-full"
    >
      <LocateFixed className="mr-2 h-4 w-4" />

      {loading ? "Fetching location..." : "Use Current Location"}
    </button>
  );
}