import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DriverMap from "../components/DeliveryMap";
import OrderTimeline from "../components/OrderTimeline";
import DeliveryETA from "../components/DeliveryETA";
import ChatEnhanced from "../components/ChatEnhanced";
import { getOrderDetails } from "../utils/firebaseHelpers";

export default function OrderTrack() {
  const { orderId } = useParams();
  console.log("Order ID PARAM:", orderId);

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) getOrderDetails(orderId).then(setOrder);
  }, [orderId]);

  if (!orderId)
    return (
      <div className="text-center text-red-600 mt-10 text-lg">
        ❌ Invalid Order Link (Missing Order ID)
      </div>
    );

  if (!order)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading order details...
      </div>
    );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <DriverMap orderId={orderId} />
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Order Timeline</h2>
            <OrderTimeline history={order.history} />
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <DeliveryETA order={order} />
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Chat with Support</h2>
            <ChatEnhanced chatId={`order-${orderId}`} />
          </div>
        </aside>
      </div>
    </div>
  );
}
