


import React from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function MobileCart() {
  const { items, total } = useCart();
  const nav = useNavigate();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="bg-white p-3 rounded shadow flex items-center justify-between">
        <div>
          <div className="text-sm">{items.length} items</div>
          <div className="font-semibold">₹{total}</div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={() => nav('/checkout')}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
