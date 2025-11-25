
import React from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi";

export default function StickyCart() {
  const { items } = useCart();
  const nav = useNavigate();

  if (items.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 bg-white shadow-lg p-3 rounded-full flex items-center gap-2 cursor-pointer hover:shadow-2xl transition z-50"
      onClick={() => nav("/checkout")}
    >
      <HiOutlineShoppingCart className="text-indigo-600 w-6 h-6" />
      <span className="text-sm font-semibold">{items.length}</span>
    </div>
  );
}
