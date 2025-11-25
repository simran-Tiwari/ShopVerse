import React from "react";
import { useCart, useCartDispatch } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPreview({ onClose }) {
  const { items } = useCart();
  const dispatch = useCartDispatch();
  const nav = useNavigate();

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-80 max-w-full">
      <h3 className="text-lg font-bold mb-3 text-gray-800 text-center">🛒 Your Cart</h3>

      {items.length === 0 && (
        <div className="py-6 text-center text-gray-500">Your cart is empty</div>
      )}

      <ul className="space-y-3 max-h-64 overflow-auto">
        {items.map(i => (
          <li key={i.id} className="flex gap-3 items-center p-2 rounded-lg hover:bg-indigo-50 transition">
            <img
              src={i.imageUrl}
              className="w-14 h-14 object-cover rounded-lg border"
              alt={i.name}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-800">{i.name}</div>
              <div className="text-sm text-gray-600 mt-1">₹{i.price} × {i.qty}</div>
              <div className="mt-2 flex gap-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => dispatch({ type: 'UPDATE_QTY', id: i.id, qty: Math.max(1, i.qty - 1) })}
                >-</button>
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => dispatch({ type: 'UPDATE_QTY', id: i.id, qty: i.qty + 1 })}
                >+</button>
                <button
                  className="px-2 py-1 text-red-600 hover:underline"
                  onClick={() => dispatch({ type: 'REMOVE', id: i.id })}
                >Remove</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {items.length > 0 && (
        <div className="mt-4 border-t pt-3">
          <div className="flex justify-between font-semibold text-gray-700 mb-3">
            <span>Total:</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              onClick={() => { onClose && onClose(); nav('/checkout') }}
            >Checkout</button>
            <button
              className="py-2 px-4 border rounded-lg hover:bg-gray-100 transition"
              onClick={() => dispatch({ type: 'CLEAR' })}
            >Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}
