import { useState } from "react";

interface Coordinates {
  lat: number;
  lng: number;
}

export function useGeolocation(defaultPosition: Coordinates | null = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<Coordinates | null>(defaultPosition);
  const [error, setError] = useState<string | null>(null);

  function getPosition(): void {
    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (geolocationError) => {
        setError(geolocationError.message);
        setIsLoading(false);
      },
    );
  }

  return { isLoading, position, error, getPosition };
}