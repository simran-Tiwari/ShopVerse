import React, { useEffect, useState, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";
import { predictETA } from "../utils/etaPredictor";

export default function DeliveryETA({ order }) {
  const [etaMin, setEtaMin] = useState(null);
  const [remainingMs, setRemainingMs] = useState(null);
  const timerRef = useRef();
  const endTimeRef = useRef();

  useEffect(() => {
    if (!order?._id) return; 

    const unsub = onSnapshot(doc(db, "orders", order._id), snap => { // <-- FIXED
      const updated = snap.data();
      if (!updated) return;

      const predicted = predictETA(updated);
      setEtaMin(predicted);
      endTimeRef.current = Date.now() + predicted * 60 * 1000;
    });

    return () => unsub();
  }, [order]);

  useEffect(() => {
    function tick() {
      if (!endTimeRef.current) return;
      const msLeft = endTimeRef.current - Date.now();
      setRemainingMs(msLeft > 0 ? msLeft : 0);

      if (msLeft <= 0 && timerRef.current) clearInterval(timerRef.current);
    }

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="bg-white p-3 rounded shadow">
      <div className="font-medium">Estimated Delivery</div>
      <div className="text-2xl font-bold">{etaMin ? `${etaMin} mins` : "--"}</div>
      <div className="text-sm text-gray-600">Remaining: {remainingMs !== null ? Math.ceil(remainingMs / 60000) + " min" : "--"}</div>
    </div>
  );
}
