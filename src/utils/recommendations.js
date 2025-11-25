
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

export async function getUserRecommendations(userId) {
  const db = getFirestore();

  const snap = await getDocs(collection(db, "orders"));
  const allOrders = snap.docs.map((d) => d.data());

  const userOrders = allOrders.filter((o) => o.userId === userId);

  const bought = {};
  userOrders.forEach((o) => {
    o.items.forEach((i) => {
      bought[i.productId] = (bought[i.productId] || 0) + 1;
    });
  });

  const recommendations = Object.keys(bought).slice(0, 10);
  return recommendations;
}

export async function getRelatedProducts(category) {
  const db = getFirestore();
  const q = query(collection(db, "products"), where("category", "==", category));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
