
import { useEffect, useRef } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";


export function useDriverLocationMock(driverId, routePoints = [], intervalMs = 3000) {
  const idxRef = useRef(0);
  useEffect(() => {
    if (!driverId || !routePoints?.length) return;
    let mounted = true;

    const updateLocation = async () => {
      if (!mounted) return;
      const point = routePoints[idxRef.current % routePoints.length];
      try {
        await updateDoc(doc(db, "drivers", driverId), {
          lat: point.lat,
          lng: point.lng,
          updatedAt: serverTimestamp()
        });
      } catch (e) {
        console.error("Mock location write error:", e);
      }
      idxRef.current += 1;
    };

    updateLocation();
    const handle = setInterval(updateLocation, intervalMs);
    return () => { mounted = false; clearInterval(handle); };
  }, [driverId, routePoints, intervalMs]);
}
