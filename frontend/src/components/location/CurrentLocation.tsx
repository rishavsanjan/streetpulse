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
      className="flex-1 flex items-center justify-center gap-sm bg-white border border-outline-variant/40 hover:border-primary py-3 rounded-xl font-label-md text-label-md transition-all active:scale-[0.98] shadow-sm"
    >
      <LocateFixed className="w-5 h-5 text-primary" />


      {loading ? "Fetching location..." : "Use Current Location"}
    </button>
  );
}