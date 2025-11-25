

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, query, where, limit, onSnapshot } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCartActions } from "../contexts/CartContext"; // ✅ updated
import { useWishlist } from "../contexts/WishlistContext";

export default function ProductDetails({ setLatestReward, setLatestBadge }) {
  const { id } = useParams();
  const [user] = useAuthState(auth);
  const [product, setProduct] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [related, setRelated] = useState([]);

  const { addItem } = useCartActions(); // ✅ replaced dispatch
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = wishlistItems.some((w) => w.productId === id);

  // Load product
  useEffect(() => {
    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
    };
    fetchProduct();
  }, [id]);

  // Load vendor
  useEffect(() => {
    if (!product?.vendorId) return;
    const loadVendor = async () => {
      const snap = await getDoc(doc(db, "vendors", product.vendorId));
      if (snap.exists()) setVendor(snap.data());
    };
    loadVendor();
  }, [product]);

  // Load related products
  useEffect(() => {
    if (!product?.category) return;
    const q = query(collection(db, "products"), where("category", "==", product.category), limit(6));
    return onSnapshot(q, (snap) => {
      const items = snap.docs
        .filter((d) => d.id !== product.id)
        .map((d) => ({ id: d.id, ...d.data() }));
      setRelated(items);
    });
  }, [product]);

  // Toggle wishlist
  async function toggleWishlist() {
    if (!user) return alert("Please login to use wishlist!");
    if (inWishlist) {
      await removeFromWishlist(product.id);
      setLatestReward({ title: "Removed from Wishlist", message: product.title });
    } else {
      await addToWishlist(product);
      setLatestReward({ title: "Added to Wishlist", message: product.title });
      // Optional badge for first wishlist
      if (wishlistItems.length === 0) setLatestBadge("first-wishlist");
    }
  }

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left: Image + Actions */}
      <div className="col-span-1 md:col-span-2">
        <img src={product.imageUrl} alt={product.title} className="w-full rounded-xl shadow-lg" />
        <h2 className="text-3xl font-semibold mt-4">{product.title}</h2>
        <p className="text-2xl font-bold text-indigo-600">₹{product.price}</p>

        <div className="flex gap-4 mt-5">
          <button
            onClick={() => {
              addItem(product); // ✅ replaced dispatch
              setLatestReward({ title: "Added to Cart", message: product.title });
            }}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
          >
            🛒 Add to Cart
          </button>

          <button
            onClick={toggleWishlist}
            className="border px-5 py-2 rounded-lg hover:bg-gray-100"
          >
            {inWishlist ? "💔 Remove from Wishlist" : "❤️ Add to Wishlist"}
          </button>
        </div>
      </div>

      {/* Right: Vendor + Related */}
      <div className="col-span-1">
        <h3 className="font-semibold text-lg mb-2">Vendor</h3>
        <p className="text-gray-700">{vendor ? vendor.name : "Unknown vendor"}</p>

        <h3 className="font-semibold text-lg mt-6 mb-3">Related Products</h3>
        {related.length === 0 ? (
          <p className="text-gray-500 text-sm">No related items</p>
        ) : (
          related.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              className="mb-4 block border-b pb-3 hover:text-indigo-600 hover:underline"
            >
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-600">₹{item.price}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
