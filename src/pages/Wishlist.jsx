
import React from "react";
import { useWishlist } from "../contexts/WishlistContext";
import { useNavigate } from "react-router-dom";

export default function WishlistPage() {
  const { items, loading, removeFromWishlist } = useWishlist();
  const nav = useNavigate();

  if (loading) return <div className="text-center p-6">Loading wishlist...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Wishlist ❤️</h2>

      {items.length === 0 ? (
        <div className="text-gray-500">Your wishlist is empty.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((p) => (
            <div key={p.productId} className="bg-white p-3 rounded shadow flex flex-col">
              <img src={p.imageUrl} className="w-full h-36 object-cover rounded" alt={p.name} />
              <div className="mt-2 flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-indigo-600">₹{p.price}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => nav(`/product/${p.productId}`)} className="flex-1 px-2 py-1 border rounded">View</button>
                <button onClick={() => removeFromWishlist(p.productId)} className="px-3 py-1 bg-red-500 text-white rounded">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
