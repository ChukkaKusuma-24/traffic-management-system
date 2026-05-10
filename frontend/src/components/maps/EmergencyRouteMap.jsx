import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

export function EmergencyRouteMap({ junctions, events }) {
  const center = junctions[0]
    ? [junctions[0].latitude, junctions[0].longitude]
    : [28.6139, 77.209];

  const routeCoordinates = events.flatMap((event) =>
    (event.routes ?? [])
      .slice()
      .sort((a, b) => a.routeOrder - b.routeOrder)
      .map((route) => junctions.find((junction) => junction.id === route.junctionId))
      .filter(Boolean)
      .map((junction) => [junction.latitude, junction.longitude])
  );

  return (
    <div className="h-[360px] overflow-hidden rounded-xl border border-white/15">
      <MapContainer center={center} zoom={11} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {junctions.map((junction) => (
          <Marker key={junction.id} position={[junction.latitude, junction.longitude]}>
            <Popup>{junction.name}</Popup>
          </Marker>
        ))}
        {routeCoordinates.length > 1 ? (
          <Polyline positions={routeCoordinates} pathOptions={{ color: "#f43f5e", weight: 5 }} />
        ) : null}
      </MapContainer>
    </div>
  );
}
