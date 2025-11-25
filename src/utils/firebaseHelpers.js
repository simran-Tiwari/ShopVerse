

import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getOrderDetails(orderId) {
  if (!orderId) return null; // Prevent crash

  const ref = doc(db, "orders", orderId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
}
