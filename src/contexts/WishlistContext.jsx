
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { onSnapshot, collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [user] = useAuthState(auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const col = collection(db, "users", user.uid, "wishlist");
    const unsub = onSnapshot(col, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(arr);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const addToWishlist = async (product) => {
    if (!user) throw new Error("Not logged in");
    const ref = doc(db, "users", user.uid, "wishlist", product.id);
    await setDoc(ref, {
      productId: product.id,
      name: product.title || product.name,
      imageUrl: product.imageUrl,
      price: product.price || 0,
      createdAt: new Date(),
    });
  };

  const removeFromWishlist = async (productId) => {
    if (!user) throw new Error("Not logged in");
    const ref = doc(db, "users", user.uid, "wishlist", productId);
    await deleteDoc(ref);
  };

  return (
    <WishlistContext.Provider value={{ items, loading, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
