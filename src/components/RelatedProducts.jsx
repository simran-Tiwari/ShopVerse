
import React, { useEffect, useState } from "react";
import { getRelatedProducts } from "../utils/recommendations";

export default function RelatedProducts({ category }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      const list = await getRelatedProducts(category);
      setItems(list);
    }
    load();
  }, [category]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Related Products</h3>

      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {items.map((p) => (
          <div
            key={p.id}
            className="min-w-[140px] bg-white rounded-lg shadow hover:shadow-lg flex-shrink-0 transition p-3"
          >
            <div className="h-28 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <p className="mt-2 font-medium truncate">{p.name}</p>
            <p className="text-sm text-gray-500 mt-1">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
