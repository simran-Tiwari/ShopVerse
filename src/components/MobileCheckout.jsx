
import React, { useState } from "react";
import { useCart, useCartDispatch } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export default function MobileCheckout() {
  const { items, total } = useCart();
  const dispatch = useCartDispatch();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({ name: "", address: "", phone: "" });
  const [payment, setPayment] = useState("COD");

  async function placeOrder() {
    await addDoc(collection(db, "orders"), {
      items,
      total,
      shipping,
      payment,
      status: "Pending",
      createdAt: Timestamp.now(),
    });

    dispatch({ type: "CLEAR" });
    navigate("/order-timeline");
  }

  return (
    <div className="p-4 md:hidden">
      <h2 className="text-xl font-bold">Checkout</h2>

      <input className="border mt-2 p-2 w-full" placeholder="Name" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} />
      <input className="border mt-2 p-2 w-full" placeholder="Address" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} />
      <input className="border mt-2 p-2 w-full" placeholder="Phone" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} />

      <select className="border mt-3 p-2 w-full" value={payment} onChange={e => setPayment(e.target.value)}>
        <option>COD</option>
        <option>UPI</option>
        <option>Card</option>
      </select>

      <button className="mt-4 w-full bg-green-600 text-white py-3 rounded" onClick={placeOrder}>
        Place Order (₹{total})
      </button>
    </div>
  );
}
