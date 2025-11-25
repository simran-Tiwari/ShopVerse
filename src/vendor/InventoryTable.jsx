
import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../utils/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function InventoryTable() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState({});
  const [form, setForm] = useState({ name: "", details: "", price: "", imageUrl: "", imageFile: null });

  const productsRef = collection(db, "products");

  // --- Load vendor products ---
  useEffect(() => {
    async function fetchProducts() {
      const snap = await getDocs(productsRef);
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.vendorId === auth.currentUser.uid);
      setProducts(data);
    }
    fetchProducts();
  }, []);

  // --- Add product ---
  const addProduct = async () => {
    try {
      let finalImageUrl = form.imageUrl;

      if (form.imageFile) {
        const storageRef = ref(storage, `products/${form.imageFile.name}`);
        await uploadBytes(storageRef, form.imageFile);
        finalImageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(productsRef, {
        name: form.name,
        details: form.details,
        price: parseFloat(form.price),
        imageUrl: finalImageUrl,
        vendorId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setForm({ name: "", details: "", price: "", imageUrl: "", imageFile: null });

      // Refresh
      const snap = await getDocs(productsRef);
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.vendorId === auth.currentUser.uid);
      setProducts(data);
    } catch (err) {
      console.error("Error adding product:", err.message);
    }
  };

  // --- Delete product ---
  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // --- Save edit ---
  const saveEdit = async (id) => {
    const data = editing[id];
    let finalImageUrl = data.imageUrl;

    if (data.imageFile) {
      const storageRef = ref(storage, `products/${data.imageFile.name}`);
      await uploadBytes(storageRef, data.imageFile);
      finalImageUrl = await getDownloadURL(storageRef);
    }

    await updateDoc(doc(db, "products", id), {
      name: data.name,
      details: data.details,
      price: parseFloat(data.price),
      imageUrl: finalImageUrl,
    });

    setEditing(prev => {
      const newEdit = { ...prev };
      delete newEdit[id];
      return newEdit;
    });

    // Refresh
    const snap = await getDocs(productsRef);
    const dataList = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => p.vendorId === auth.currentUser.uid);
    setProducts(dataList);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Inventory</h2>

      {/* Add Product Form */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="font-semibold mb-2">Add New Product</h3>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Product Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Product Details"
          value={form.details}
          onChange={e => setForm({ ...form, details: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={e => setForm({ ...form, imageUrl: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setForm({ ...form, imageFile: e.target.files[0] })}
          className="mb-2"
        />
        <button onClick={addProduct} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </div>

      {/* Products List */}
      <div className="grid md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="border p-4 rounded shadow">
            <img
              src={editing[p.id]?.imageFile ? URL.createObjectURL(editing[p.id].imageFile) : p.imageUrl || "https://via.placeholder.com/150"}
              alt={p.name}
              className="mb-2 w-full h-40 object-cover rounded"
            />
            {editing[p.id] ? (
              <>
                <input
                  className="border p-1 w-full mb-1"
                  value={editing[p.id].name}
                  onChange={e => setEditing(prev => ({ ...prev, [p.id]: { ...prev[p.id], name: e.target.value } }))}
                />
                <textarea
                  className="border p-1 w-full mb-1"
                  value={editing[p.id].details}
                  onChange={e => setEditing(prev => ({ ...prev, [p.id]: { ...prev[p.id], details: e.target.value } }))}
                />
                <input
                  className="border p-1 w-full mb-1"
                  type="number"
                  value={editing[p.id].price}
                  onChange={e => setEditing(prev => ({ ...prev, [p.id]: { ...prev[p.id], price: e.target.value } }))}
                />
                <input
                  type="file"
                  onChange={e => setEditing(prev => ({ ...prev, [p.id]: { ...prev[p.id], imageFile: e.target.files[0] } }))}
                  className="mb-1"
                />
                <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => saveEdit(p.id)}>Save</button>
                  <button className="border px-3 py-1 rounded" onClick={() => setEditing(prev => { const n={...prev}; delete n[p.id]; return n; })}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm mb-1">{p.details}</p>
                <p className="font-semibold mb-2">${p.price}</p>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(prev => ({ ...prev, [p.id]: { name: p.name, details: p.details, price: p.price, imageUrl: p.imageUrl } }))} className="bg-indigo-600 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => deleteProduct(p.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

