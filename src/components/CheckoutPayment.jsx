

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("<YOUR_STRIPE_PUBLIC_KEY>");

export default function CheckoutPayment({ amount }) {
  const [loading, setLoading] = useState(false);

  const createCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) throw new Error("Failed to create checkout session");

      const data = await res.json();
      const stripe = await stripePromise;

      if (!stripe) throw new Error("Stripe not loaded");

      const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
      if (error) console.error("Stripe checkout error:", error.message);
    } catch (err) {
      console.error("Checkout error:", err.message);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={createCheckout}
      disabled={loading}
      className={`bg-indigo-600 text-white px-5 py-2 rounded transition ${
        loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
      }`}
    >
      {loading ? "Processing..." : `Pay ₹${amount}`}
    </button>
  );
}
