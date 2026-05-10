import "leaflet/dist/leaflet.css";
import { Circle, MapContainer, Popup, TileLayer } from "react-leaflet";
import { formatPercent } from "../../utils/formatters";

function colorByCongestion(value) {
  if (value > 0.75) return "#ef4444";
  if (value > 0.5) return "#f59e0b";
  return "#22c55e";
}

export function CityHeatMap({ junctions, trafficUpdates }) {
  const center = junctions[0]
    ? [junctions[0].latitude, junctions[0].longitude]
    : [28.6139, 77.209];

  const congestionByJunction = Object.fromEntries(
    trafficUpdates.map((update) => [update.junctionId, update.congestionLevel])
  );

  return (
    <div className="h-[360px] overflow-hidden rounded-xl border border-white/15">
      <MapContainer center={center} zoom={11} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {junctions.map((junction) => {
          const congestion = congestionByJunction[junction.id] ?? 0.4;
          return (
            <Circle
              key={junction.id}
              center={[junction.latitude, junction.longitude]}
              radius={550}
              pathOptions={{
                color: colorByCongestion(congestion),
                fillOpacity: 0.4,
              }}
            >
              <Popup>
                <p className="font-semibold">{junction.name}</p>
                <p>Area: {junction.area}</p>
                <p>Congestion: {formatPercent(congestion)}</p>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
    </div>
  );
}
