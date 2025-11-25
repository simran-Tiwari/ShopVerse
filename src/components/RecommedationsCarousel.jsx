import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getUserRecommendations } from "../utils/recommendations";

export default function RecommendationCarousel() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      const uid = localStorage.getItem("uid");
      if (!uid) return;

      const recIds = await getUserRecommendations(uid);

      const db = getFirestore();
      const products = [];

      for (let id of recIds) {
        const snap = await getDoc(doc(db, "products", id));
        if (snap.exists()) products.push({ id, ...snap.data() });
      }

      setItems(products);
    }
    load();
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>

      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {items.map((p) => (
          <div
            key={p.id}
            className="min-w-[180px] bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex-shrink-0"
          >
            <div className="h-32 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
              <img
                src={p.imageUrl || p.image}
                alt={p.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <p className="font-medium mt-2 truncate">{p.name}</p>
            <p className="text-sm text-gray-500 mt-1">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
