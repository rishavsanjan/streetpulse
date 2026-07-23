"use client";

import { MapPin } from "lucide-react";
import type { SelectedLocation } from "./types";

interface SelectedLocationCardProps {
  location: SelectedLocation;
}

export default function SelectedLocationCard({
  location,
}: SelectedLocationCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-green-100 p-2">
          <MapPin className="h-5 w-5 text-green-600" />
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-gray-900">
            Selected Location
          </h3>

          <p className="text-sm text-gray-600 break-words">
            {location.address || "No address selected"}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">
                Latitude
              </span>

              <p className="text-gray-500">
                {location.latitude.toFixed(6)}
              </p>
            </div>

            <div>
              <span className="font-medium text-gray-700">
                Longitude
              </span>

              <p className="text-gray-500">
                {location.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}