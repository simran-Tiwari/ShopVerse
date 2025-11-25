
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";
import OrderTimeline from "../components/OrderTimeline";
import DeliveryMap from "../components/DeliveryMap";
import DeliveryETA from "../components/DeliveryETA";
import ChatEnhanced from "../components/ChatEnhanced";

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "orders", orderId), (snap) =>
      setOrder({ id: snap.id, ...snap.data() })
    );
    return () => unsub();
  }, [orderId]);

  if (!order) {
    return <div className="flex justify-center items-center h-64 text-gray-500">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div className="lg:col-span-2 space-y-6">
        <OrderTimeline history={order.history || []} />

        <div>
          <h3 className="font-semibold mb-2 text-lg">Order Items</h3>
          <ul className="bg-white p-4 rounded shadow divide-y">
            {order.items.map((item) => (
              <li key={item.productId} className="flex gap-4 py-2">
                <img src={item.imageUrl} className="w-16 h-16 rounded"/>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  <p className="text-sm text-indigo-600 font-semibold">₹{item.price * item.qty}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <ChatEnhanced orderId={orderId} />
      </div>

      <aside className="space-y-6">
        <DeliveryETA order={order} />
        <DeliveryMap orderId={orderId} />
      </aside>
    </div>
  );
}
