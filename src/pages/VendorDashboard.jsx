
import React, { useState, useEffect } from "react";
import SalesAnalytics from "../vendor/SalesAnalytics";
import Recommendations from "../vendor/Recommendations";
import { db, storage } from "../utils/firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function VendorDashboard() {
  const [tab, setTab] = useState("inventory");
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const productsRef = collection(db, "products");

  // Fetch vendor products
  const fetchProducts = async () => {
    if (!user) return;
    const snap = await getDocs(productsRef);
    const vendorProducts = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p) => p.vendorId === user.uid);
    setProducts(vendorProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  // Add product
  const addProduct = async () => {
    if (!user) return alert("You must be logged in as a vendor.");

    if (!name || !price) return alert("Please provide product name and price.");

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "vendor") {
        return alert("You do not have permission to add products.");
      }

      let finalImageUrl = imageUrl;

      if (imageFile) {
        const storageRef = ref(storage, `products/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(productsRef, {
        name,
        details,
        price: parseFloat(price),
        imageUrl: finalImageUrl,
        vendorId: user.uid,
        createdAt: serverTimestamp(),
      });

      alert("Product added successfully!");
      setName("");
      setDetails("");
      setPrice("");
      setImageUrl("");
      setImageFile(null);

      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err.message);
      alert("Failed to add product. Try again.");
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const renderTabButton = (label, value) => (
    <button
      onClick={() => setTab(value)}
      className={`px-5 py-2 rounded-lg font-medium transition ${
        tab === value
          ? "bg-indigo-600 text-white shadow-lg"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Vendor Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {renderTabButton("Inventory", "inventory")}
        {renderTabButton("Sales Analytics", "analytics")}
        {renderTabButton("Recommendations", "recommend")}
      </div>

      {/* Inventory Tab */}
      {tab === "inventory" && (
        <div className="space-y-6">
          {/* Add Product Form */}
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Add New Product
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="border p-3 rounded-lg"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="border p-3 rounded-lg"
                placeholder="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <textarea
                className="border p-3 rounded-lg md:col-span-2"
                placeholder="Product Details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
              <input
                className="border p-3 rounded-lg"
                placeholder="Image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="md:col-span-2"
              />
            </div>

            <button
              onClick={addProduct}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              Add Product
            </button>
          </div>

          {/* Product List */}
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white shadow rounded-xl overflow-hidden"
              >
                <img
                  src={p.imageUrl || "https://via.placeholder.com/300"}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{p.details}</p>
                  <p className="font-bold text-indigo-600 mb-2">${p.price}</p>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "analytics" && <SalesAnalytics />}
      {tab === "recommend" && <Recommendations />}
    </div>
  );
}
