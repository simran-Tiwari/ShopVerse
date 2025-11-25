
import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import RecommendationCarousel from "../components/RecommedationsCarousel";
import CategoryList from "../components/CategoryList";

export default function Home() {
  const db = getFirestore();
  const [topProducts, setTopProducts] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "products"));
      setTopProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    load();
  }, []);

  return (
    <div className="space-y-12 px-4 md:px-8">

      {/* HERO SECTION */}
      <section className="bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-10 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold">Shop Smarter with Shopverse</h1>
        <p className="mt-3 text-lg md:text-xl">Your multi-vendor marketplace with real-time tracking & rewards.</p>
        
        <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
          {/* Explore Button for Users */}
          <button
            onClick={() => nav("/shop")}
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
          >
            Explore Now
          </button>

          {/* Sell Button for Vendors */}
          <button
            onClick={() => nav("/auth-vendor-register")}
            className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
          >
            Sell on Shopverse
          </button>
        </div>

        <p className="mt-3 text-sm md:text-base text-white/80">
          Join thousands of sellers and start earning today.
        </p>
      </section>

      {/* RECOMMENDATIONS */}
      <section>
        <RecommendationCarousel />
      </section>

      {/* CATEGORIES */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Shop by Categories</h2>
        <CategoryList />
      </section>

      {/* TOP PRODUCTS */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Trending Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {topProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <img src={p.imageUrl} alt={p.name} className="h-40 w-full object-cover rounded-t-lg" />
              <div className="p-3">
                <h3 className="font-semibold text-gray-800">{p.name}</h3>
                <p className="text-indigo-600 font-bold mt-1">₹{p.price}</p>
                <button className="mt-3 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
