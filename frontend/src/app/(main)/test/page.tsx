"use client";

import { useState } from "react";
import type { SelectedLocation } from "@/components/location/types";
import GoogleMap from "@/components/location/GoogleMap";
import CurrentLocation from "@/components/location/CurrentLocation";
import SearchBox from "@/components/location/SearchBox";
import SelectedLocationCard from "@/components/location/SelectedLocationCard";

export default function TestPage() {
    const [location, setLocation] = useState<SelectedLocation>({
        address: "",
        latitude: 28.6139,
        longitude: 77.2090,
    });


    return (
        <div className="p-8">
            <SearchBox onLocationChange={setLocation} />

            <GoogleMap
                location={location}
                onLocationChange={setLocation}
            />
            <CurrentLocation onLocationChange={setLocation} />

            <SelectedLocationCard
                location={location}
            />

            <pre className="mt-6 rounded bg-black p-4 text-white">
                {JSON.stringify(location, null, 2)}
            </pre>
        </div>
    );
}