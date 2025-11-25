import React, { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

export default function OrderHistory() {
  const [user, loading] = useAuthState(auth);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) =>
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    return () => unsub();
  }, [user]);

  if (loading)
    return <div className="text-center mt-20 text-gray-500">Loading orders...</div>;
  if (!user)
    return <div className="text-center mt-20 text-gray-500">Please log in to view orders.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o, idx) => (
            <div
              key={o.id}
              className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
            >
              <div>
                <div className="font-medium text-indigo-600">Order #{o.id}</div>
                <div className="text-sm text-gray-600">Status: <span className={`font-semibold ${o.status === 'delivered' ? 'text-green-600' : o.status === 'processing' ? 'text-yellow-600' : 'text-gray-600'}`}>{o.status}</span></div>
                <div className="text-sm text-gray-600">Items: {o.items?.length || 0}</div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-lg">₹{o.total}</div>
                <Link
                  to={`/order/${o.id}`}
                  className="mt-2 inline-block text-indigo-600 font-medium hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
