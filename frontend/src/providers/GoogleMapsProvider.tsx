"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { ReactNode } from "react";

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export default function GoogleMapsProvider({
  children,
}: GoogleMapsProviderProps) {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      solutionChannel="street-pulse"
    >
      {children}
    </APIProvider>
  );
}