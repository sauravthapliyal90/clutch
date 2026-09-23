import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import { useMeet } from "../hooks/useMeets";

const defaultCenter = [28.6139, 77.2090]; // Delhi

function MeetsMap() {
  const { data, isLoading, isError } = useMeet();

  const meets = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="h-[360px] flex items-center justify-center text-white">
        Loading map...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[360px] flex items-center justify-center text-white">
        Failed to load map.
      </div>
    );
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={5}
      scrollWheelZoom={false}
      className="w-full h-[75vh] rounded-lg"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        url={`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${import.meta.env.VITE_MAPS_API_KEY}`}
      />

      {meets.map((meet) => {
        if (
          typeof meet.latitude !== "number" ||
          typeof meet.longitude !== "number"
        ) {
          return null;
        }

        return (
          <Marker
            key={meet.id}
            position={[meet.latitude, meet.longitude]}
          >
            <Popup>
              <div>
                <h3>{meet.title}</h3>
                <p>{meet.location}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MeetsMap;