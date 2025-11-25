import React from "react";

export default function Orders() {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your Orders
      </h1>

      <div className="flex flex-col items-center justify-center p-10 bg-white shadow-md rounded-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h18M3 7h18M3 11h18M3 15h18M3 19h18"
          />
        </svg>

        <p className="text-gray-500 text-center">
          No orders found yet. Once you place an order, it will appear here.
        </p>

        <a
          href="/"
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
}
