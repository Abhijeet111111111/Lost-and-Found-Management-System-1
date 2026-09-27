import styles from "./Map.module.css";
import type { ReactElement } from "react";
import type { LatLngTuple } from "leaflet";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useGeolocation } from "../hooks/useGeolocation";
import ButtonRelative from "./ButtonRelative";

const DEFAULT_POSITION: LatLngTuple = [31.251806017951644, 75.70353800503449];

function Map(): ReactElement {
  const [searchParams] = useSearchParams();
  const { position: geoPosition, getPosition } = useGeolocation();
  // const { cities } = useCities();
  // const navigate = useNavigate();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const latitude = lat === null ? Number.NaN : Number(lat);
  const longitude = lng === null ? Number.NaN : Number(lng);
  const urlPosition: LatLngTuple | null =
    Number.isFinite(latitude) && Number.isFinite(longitude)
      ? [latitude, longitude]
      : null;
  const position: LatLngTuple =
    urlPosition ??
    (geoPosition === null
      ? DEFAULT_POSITION
      : [geoPosition.lat, geoPosition.lng]);

  return (
    <div className={styles.mapContainer}>
      {/* {isGeoPositionLoading && <Spinner />} */}

      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="http://www.esri.com/">OpenStreetMap</a> contributors'
          url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={20}
          minZoom={18}
        />

        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        <Marker position={position}>
          <Popup>""</Popup>
        </Marker>
        <ChangeCenter position={position} />
        <DetectClick />
      </MapContainer>
      <p className="absolute z-[1000] bottom-[4rem] left-[50%] translate-x-[-50%] uppercase font-semibold text-md text-slate-100 bg-slate-800 p-2 opacity-50">
        Point on the map where the item was lost
      </p>
      {/* <ButtonRelative styleClass="position" fn={getPosition}>
        Use Your Location
      </ButtonRelative> */}
    </div>
  );
}

function ChangeCenter({ position }: { position: LatLngTuple }): null {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick(): null {
  const navigate = useNavigate();

  useMapEvents({
    click: (event) =>
      navigate(`?lat=${event.latlng.lat}&lng=${event.latlng.lng}`),
  });

  return null;
}

export default Map;
