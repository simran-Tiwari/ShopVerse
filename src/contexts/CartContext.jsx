import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const initialState = { items: [], total: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload, total: calculateTotal(action.payload) };

    case "ADD": {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      let newItems;
      if (existing) {
        newItems = state.items.map(i =>
          i.productId === action.payload.productId ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        newItems = [...state.items, { ...action.payload, qty: 1 }];
      }
      return { ...state, items: newItems, total: calculateTotal(newItems) };
    }

    case "UPDATE_QTY": {
      const updated = state.items.map(i =>
        i.productId === action.id || i.id === action.id ? { ...i, qty: action.qty } : i
      );
      return { ...state, items: updated, total: calculateTotal(updated) };
    }

    case "REMOVE": {
      const filtered = state.items.filter(i => i.id !== action.id && i.productId !== action.id);
      return { ...state, items: filtered, total: calculateTotal(filtered) };
    }

    case "CLEAR":
      return initialState;

    default:
      return state;
  }
}

function calculateTotal(items) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

// Provider
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    if (saved.length) dispatch({ type: "SET_ITEMS", payload: saved });
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

// Hook to access state
export const useCart = () => useContext(CartStateContext);

// Hook to access actions and trigger reward/badge
export const useCartActions = (setLatestReward, setLatestBadge) => {
  const dispatch = useContext(CartDispatchContext);
  const { items, total } = useCart();

  const addItem = (product) => {
    dispatch({ type: "ADD", payload: product });

    // Trigger reward example
    if (setLatestReward) {
      setLatestReward({
        title: "Item Added!",
        message: `${product.name} has been added to your cart!`,
      });
    }
  };

  const updateQty = (id, qty) => {
    dispatch({ type: "UPDATE_QTY", id, qty });

    const item = items.find(i => i.id === id || i.productId === id);
    if (qty >= 5 && setLatestReward && item) {
      setLatestReward({
        title: "Bulk Buyer Bonus!",
        message: `You added ${qty}x ${item.name}!`,
      });
    }
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE", id });
    if (setLatestBadge) {
      setLatestBadge(`removed-${id}`); // Example badge
    }
  };

  const clearCart = () => dispatch({ type: "CLEAR" });

  return { items, total, addItem, updateQty, removeItem, clearCart };
};
