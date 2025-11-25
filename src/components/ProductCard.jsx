




import React from "react";
import { useCartActions } from "../contexts/CartContext"; // ✅ useCartActions instead
import { useWishlist } from "../contexts/WishlistContext";

export default function ProductCard({ product, onQuickView, setLatestReward, setLatestBadge }) {
  // Pass setLatestReward & setLatestBadge so rewards work on add to cart
  const { addItem } = useCartActions(setLatestReward, setLatestBadge);
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  const inWishlist = wishlistItems.some((w) => w.productId === product.id);

  function addToCart() {
    addItem({
      productId: product.id,
      name: product.title || product.name,
      price: product.price,
      image: product.imageUrl,
    });
  }

  async function toggleWishlist(e) {
    e.stopPropagation();
    try {
      if (inWishlist) await removeFromWishlist(product.id);
      else await addToWishlist(product);
    } catch (err) {
      console.error(err);
      alert("Please login to manage wishlist");
    }
  }

  return (
    <div className="bg-white p-3 rounded shadow relative">
      {/* Heart icon */}
      <button
        onClick={toggleWishlist}
        className={`absolute top-3 right-3 p-1 rounded-full ${
          inWishlist ? "bg-pink-100" : "bg-white"
        } hover:scale-105 transition`}
        aria-label="Toggle wishlist"
      >
        {inWishlist ? "❤️" : "🤍"}
      </button>

      <img
        src={product.imageUrl}
        alt={product.title || product.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="mt-2 font-medium">{product.title || product.name}</h3>
      <div className="flex items-center justify-between mt-2">
        <div className="font-semibold">₹{product.price}</div>
        <div className="flex gap-2">
          <button onClick={addToCart} className="px-3 py-1 bg-indigo-600 text-white rounded">
            Add
          </button>
          <button onClick={onQuickView} className="px-2 py-1 border rounded">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
