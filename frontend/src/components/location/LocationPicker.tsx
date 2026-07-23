"use client";

import { useEffect } from "react";

import CurrentLocation from "./CurrentLocation";
import GoogleMap from "./GoogleMap";
import SelectedLocationCard from "./SelectedLocationCard";
import type { SelectedLocation } from "./types";
import SearchBox from "./SearchBox";

interface LocationPickerProps {
  value: SelectedLocation;
  onChange: (location: SelectedLocation) => void;
}

export default function LocationPicker({
  value,
  onChange,
}: LocationPickerProps) {
  useEffect(() => {
    if (!value.address) return;

    console.log("Selected Location:", value);
  }, [value]);

  return (
    <div className="space-y-5">
      <SearchBox onLocationChange={onChange} />

      <CurrentLocation onLocationChange={onChange} />

      <GoogleMap
        location={value}
        onLocationChange={onChange}
      />

      <SelectedLocationCard location={value} />
    </div>
  );
}