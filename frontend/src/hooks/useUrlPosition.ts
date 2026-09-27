import { useSearchParams } from "react-router-dom";

export function useUrlPosition(): readonly [
  latitude: string | null,
  longitude: string | null,
] {
  const [searchParams] = useSearchParams();
  const latitude = searchParams.get("lat");
  const longitude = searchParams.get("lng");

  return [latitude, longitude];
}