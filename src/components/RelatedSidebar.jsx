
import React from "react";

export default function RelatedSidebar({ product, allProducts = [] }) {
  const related = allProducts
    .filter(p => p.id !== product.id && p.tags && product.tags && p.tags.some(t => product.tags.includes(t)))
    .slice(0, 5);

  if (!related.length) return <div className="text-sm text-gray-500">No related items</div>;

  return (
    <ul className="space-y-2">
      {related.map(r => (
        <li key={r.id} className="flex gap-2 items-center">
          <img src={r.imageUrl} className="w-12 h-12 object-cover rounded" alt={r.name} />
          <div className="text-sm">
            <div className="font-medium">{r.name}</div>
            <div className="text-xs text-gray-600">₹{r.price}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}


