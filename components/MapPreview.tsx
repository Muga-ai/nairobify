"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Issue } from "@/lib/useIssues";
import "leaflet/dist/leaflet.css";

// Fix default icon issue in Leaflet (type-safe)
const iconDefaultPrototype = L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void };
delete iconDefaultPrototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapPreviewProps {
  issues: Issue[];
}

export default function MapPreview({ issues }: MapPreviewProps) {
  // Default center: Nairobi
  const center: [number, number] = [-1.286389, 36.817223];

  // Helper: parse coordinates safely from locationText
  const parseCoordinates = (location?: string): [number, number] => {
    if (!location) return center;
    const match = location.match(/(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
    if (!match) return center;
    return [parseFloat(match[1]), parseFloat(match[2])];
  };

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {issues.map((issue) => {
        const [lat, lng] = parseCoordinates(issue.locationText);

        return (
          <Marker key={issue.id} position={[lat, lng]}>
            <Popup>
              <strong>{issue.category}</strong>
              <br />
              {issue.description}
              <br />
              <em>{issue.ward}</em>
              <br />
              Status: {issue.status.replace("_", " ")}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
