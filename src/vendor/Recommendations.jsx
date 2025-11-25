


import React, { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import  RewardToast  from "../components/RewardToast";

export default function Recommendations() {
  const [products, setProducts] = useState([]);
  const [recs, setRecs] = useState([]);
  const [toast, setToast] = useState(null);
  const lastToastRef = useRef(null);

  useEffect(() => {
    let unsub;
    const unsubAuth = onAuthStateChanged(auth, user => {
      if (!user) return;
      const q = query(collection(db, "products"), where("vendorId", "==", user.uid));
      unsub = onSnapshot(q, snap => {
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    });

    return () => { if (unsub) unsub(); unsubAuth(); };
  }, []);

  useEffect(() => {
    const list = [];
    products.forEach(p => {
      if ((p.sales || 0) > 50 && (p.stock || 0) < 10) {
        list.push({ product: p, message: "High demand — restock recommended", type: "restock" });
      }
      if ((p.rating || 0) >= 4.5) {
        list.push({ product: p, message: "Top rated — promote this product", type: "promote" });
      }
      if ((p.views || 0) > 200 && (p.sales || 0) < 5) {
        list.push({ product: p, message: "High interest but low conversion — review listing/pricing", type: "conversion" });
      }
    });
    setRecs(list);

    // Show toast only if new recommendation
    if (list.length && lastToastRef.current !== list[0].product.id) {
      const r = list[0];
      setToast({ title: `Recommendation: ${r.type}`, message: `${r.product.name} — ${r.message}` });
      lastToastRef.current = r.product.id;
      setTimeout(() => setToast(null), 8000);
    }
  }, [products]);

  return (
    <div>
      <div className="bg-white p-6 rounded shadow mb-4">
        <h3 className="font-semibold mb-3">AI Recommendations</h3>
        {recs.length === 0 ? (
          <p>No recommendations right now.</p>
        ) : (
          <ul className="space-y-2">
            {recs.map((r, i) => (
              <li key={i} className="p-3 border rounded bg-gray-50 flex justify-between items-center">
                <div>
                  <div className="font-medium">{r.product.name}</div>
                  <div className="text-sm text-gray-600">{r.message}</div>
                </div>
                <div>
                  <button
                    className="px-3 py-1 bg-indigo-600 text-white rounded"
                    onClick={() => alert("Mark as acted (placeholder)")}
                  >
                    Mark done
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast && <RewardToast title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}
