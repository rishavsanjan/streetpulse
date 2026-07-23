"use client";

import { useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import type { SelectedLocation } from "./types";

interface SearchBoxProps {
    onLocationChange: (location: SelectedLocation) => void;
}

export default function SearchBox({
    onLocationChange,
}: SearchBoxProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary("places");

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const autocomplete = new places.Autocomplete(inputRef.current, {
            fields: ["formatted_address", "geometry"],
        });

        const listener = autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.geometry?.location) return;

            onLocationChange({
                address: place.formatted_address ?? "",
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
            });
        });

        return () => {
            listener.remove();
        };
    }, [places, onLocationChange]);

    return (
        <input
            ref={inputRef}
            type="text"
            placeholder="Search for a location..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
        />
    );
}