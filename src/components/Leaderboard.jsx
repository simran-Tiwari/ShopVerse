


import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";

const rankColors = ["#FACC15", "#E5E7EB", "#C0C0C0"]; // Gold, Silver, Bronze for top 3

export default function Leaderboard({ limitCount = 10 }) {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("points", "desc"), limit(limitCount));
    const unsub = onSnapshot(q, snap => {
      setLeaders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [limitCount]);

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg w-full max-w-md mx-auto">
      <h4 className="font-bold text-xl mb-4 text-gray-800 text-center">🏆 Top Buyers</h4>
      <ol className="space-y-3">
        {leaders.map((u, idx) => (
          <li
            key={u.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition transform hover:scale-105 shadow-sm`}
            style={{
              backgroundColor: idx < 3 ? rankColors[idx] : "#F9FAFB",
              color: idx < 3 ? "#1F2937" : "#111827"
            }}
          >
            <div className="w-8 text-right font-semibold">{idx + 1}.</div>
            <div className="flex-1">
              <div className="font-medium">{u.name || u.email}</div>
              <div className="text-sm text-gray-700 mt-1">Points: {u.points || 0}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
