


import React, { useState } from "react";
import { useCart, useCartActions } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../utils/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export default function Checkout({ setLatestReward, setLatestBadge }) {
  const { items, total } = useCart();
  const { clearCart } = useCartActions();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({ name: "", address: "", phone: "" });
  const [payment, setPayment] = useState("COD");

  async function placeOrder() {
    if (!items.length) return alert("Cart empty!");
    if (!auth.currentUser) return alert("Login required!");

    const orderRef = await addDoc(collection(db, "orders"), {
      userId: auth.currentUser.uid,
      items,
      total,
      shipping,
      payment,
      status: "processing",
      history: [
        {
          status: "processing",
          at: Timestamp.now(),
          note: "Order placed",
        },
      ],
      createdAt: Timestamp.now(),
    });

    clearCart();

    setLatestReward?.({
      title: "🎉 Order Placed!",
      message: `Order amount: ₹${total}`,
    });

    if (items.length >= 5) setLatestBadge?.("shopper-badge");

    // 🔥 FIXED navigation route
    navigate(`/order-track/${orderRef.id}`);
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>

      <input
        placeholder="Name"
        className="border w-full p-2 mb-2"
        onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
      />

      <input
        placeholder="Address"
        className="border w-full p-2 mb-2"
        onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
      />

      <input
        placeholder="Phone"
        className="border w-full p-2 mb-2"
        onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
      />

      <select
        className="border p-2 w-full mb-4"
        value={payment}
        onChange={(e) => setPayment(e.target.value)}
      >
        <option>COD</option>
        <option>UPI</option>
        <option>Card</option>
      </select>

      <button onClick={placeOrder} className="w-full bg-green-600 text-white py-3 rounded">
        Place Order (₹{total})
      </button>
    </div>
  );
}
