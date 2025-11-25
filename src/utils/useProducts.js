

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot
} from "firebase/firestore";
import { db } from "../utils/firebase";

export default function useProducts({ pageSize = 12 } = {}) {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // --- Load vendors in real-time ---
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "vendors"), (snap) => {
      setVendors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // --- Real-time product updates ---
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "products"),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        vendorId: d.data().vendorId || null,
      }));
      setProducts(list);
      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === pageSize);
      setLoading(false);
    });

    return () => unsub();
  }, [pageSize]);

  // --- Load more (for pagination) ---
  async function loadMore() {
    if (!hasMore || !lastDoc) return;

    const q = query(
      collection(db, "products"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(pageSize)
    );

    const snap = await getDocs(q);

    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      vendorId: d.data().vendorId || null,
    }));

    setProducts((prev) => [...prev, ...list]);
    setLastDoc(snap.docs[snap.docs.length - 1]);
    setHasMore(snap.docs.length === pageSize);
  }

  return { products, vendors, loading, hasMore, loadMore };
}
