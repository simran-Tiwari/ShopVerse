
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartActions } from "../contexts/CartContext";

export default function Cart({ setLatestReward, setLatestBadge }) {
  const { items = [], total, removeItem, updateQty, clearCart } = useCartActions(setLatestReward, setLatestBadge);
  const navigate = useNavigate();
  const cart = items || [];

  if (!cart.length) {
    return (
      <div className="text-center mt-16 text-gray-500 text-lg font-medium">
        🛒 Your cart is empty.
        <Link to="/shop" className="ml-2 text-indigo-600 hover:text-indigo-500 font-semibold">
          Start Shopping
        </Link>
      </div>
    );
  }

  const handleQtyChange = (id, qty) => {
    if (qty < 1) return;
    updateQty(id, qty);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Your Cart</h1>
      <div className="space-y-6">
        {cart.map((item) => {
          const id = item.productId || item.id;
          return (
            <div key={id} className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-5 w-full sm:w-2/3">
                {item.image && <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded-xl shadow" />}
                <div>
                  <h2 className="font-semibold text-gray-800 text-lg">{item.name}</h2>
                  <p className="text-gray-500 font-medium mt-1">
                    Price: <span className="text-indigo-600 font-semibold">₹{item.price}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <button onClick={() => handleQtyChange(id, item.qty - 1)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">-</button>
                <span className="px-3 py-2 bg-gray-100 rounded-lg font-medium text-gray-700">{item.qty}</span>
                <button onClick={() => handleQtyChange(id, item.qty + 1)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">+</button>
                <button onClick={() => removeItem(id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Remove</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Total: <span className="text-indigo-600">₹{total}</span></h2>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate("/checkout")} className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-md">Buy Now → Checkout</button>
          <Link to="/shop" className="mt-2 sm:mt-0 inline-block px-5 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition font-semibold shadow-sm">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
