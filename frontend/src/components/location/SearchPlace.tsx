"use client";

import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import type { SelectedLocation } from "./types";

interface SearchPlaceProps {
  onLocationChange: (location: SelectedLocation) => void;
}

export default function SearchPlace({
  onLocationChange,
}: SearchPlaceProps) {
  const places = useMapsLibrary("places");

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);
  useEffect(() => {
    if (!places) return;

    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const { suggestions } =
          await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: query,
          });

        setSuggestions(suggestions);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, places]);

  async function handleSelect(suggestion: any) {
    try {
      setLoading(true);

      const place = suggestion.placePrediction.toPlace();

      await place.fetchFields({
        fields: [
          "displayName",
          "formattedAddress",
          "location",
        ],
      });

      if (!place.location) return;

      onLocationChange({
        address: place.formattedAddress ?? "",
        latitude: place.location.lat(),
        longitude: place.location.lng(),
      });
      setQuery(place.formattedAddress ?? "");
      setSuggestions([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search location..."
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
      />

      {suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-lg border bg-white shadow-lg">
          {suggestions.map((suggestion: any, index: number) => (
            <button
              key={index}
              type="button"
              disabled={loading}
              onClick={() => handleSelect(suggestion)}
              className="block w-full border-b px-4 py-3 text-left hover:bg-gray-100 last:border-none"
            >
              {suggestion.placePrediction.text.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}