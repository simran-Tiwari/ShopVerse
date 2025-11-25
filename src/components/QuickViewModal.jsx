
import React from "react";
import { useCartActions } from "../contexts/CartContext"; 
import RelatedSidebar from "./RelatedSidebar";

export default function QuickViewModal({ product, onClose, allProducts = [], setLatestReward, setLatestBadge }) {
  const { addItem } = useCartActions(); 

  function addToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      qty: 1,
    });

   
    if (setLatestReward) {
      setLatestReward({
        title: "Item Added!",
        message: `${product.name} has been added to your cart.`,
      });
    }

    onClose();
  }

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full z-10 overflow-hidden animate-fade-in">
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Section */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-contain h-full w-full transition-transform hover:scale-105"
                />
              ) : (
                <span className="text-gray-400">No image</span>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="text-xl font-bold text-indigo-600">₹{product.price}</p>
              <p className="text-sm text-gray-600">
                {product.description || "No description available."}
              </p>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={addToCart}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="bg-gray-50 p-4 rounded-lg flex flex-col gap-4">
            <div>
              <div className="text-sm text-gray-500">Vendor</div>
              <div className="font-medium text-gray-800">{product.vendorName}</div>
            </div>

            <div className="flex-1 overflow-auto">
              <h4 className="font-medium mb-2 text-gray-700">Related Products</h4>
              <RelatedSidebar product={product} allProducts={allProducts} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
