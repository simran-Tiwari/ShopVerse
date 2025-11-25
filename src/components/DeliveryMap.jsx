



// src/components/DriverMap.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Smoothly recenter map
function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { duration: 1 });
    }
  }, [position, map]);
  return null;
}

export default function DriverMap({
  driverId: propDriverId,
  orderId,
  centerFallback = { lat: 28.7041, lng: 77.1025 },
  zoom = 13,
}) {
  const [driverId, setDriverId] = useState(propDriverId);
  const [driver, setDriver] = useState(null);

  // Get driverId from order if not provided
  useEffect(() => {
    let unsubOrder;
    if (!propDriverId && orderId) {
      const orderRef = doc(db, "orders", orderId);
      unsubOrder = onSnapshot(orderRef, (snap) => {
        const data = snap.data();
        if (data?.driverId) setDriverId(data.driverId);
      });
    } else {
      setDriverId(propDriverId);
    }
    return () => unsubOrder && unsubOrder();
  }, [propDriverId, orderId]);

  // Subscribe to driver's location
  useEffect(() => {
    if (!driverId) return;
    const driverRef = doc(db, "drivers", driverId);
    const unsub = onSnapshot(driverRef, (snap) => {
      const d = snap.data();
      if (d) setDriver({ id: snap.id, ...d });
    });
    return () => unsub();
  }, [driverId]);

  const center =
    driver && driver.lat != null && driver.lng != null
      ? { lat: driver.lat, lng: driver.lng }
      : centerFallback;

  if (!driver) {
    return (
      <div className="p-4 bg-white rounded shadow">
        Loading driver location...
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow p-2">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {driver.lat != null && driver.lng != null && (
          <Marker position={{ lat: driver.lat, lng: driver.lng }}>
            <Popup>
              {driver.name || "Driver"} <br />
              Lat: {driver.lat.toFixed(4)}, Lng: {driver.lng.toFixed(4)}
            </Popup>
          </Marker>
        )}
        <Recenter position={center} />
      </MapContainer>
    </div>
  );
}
