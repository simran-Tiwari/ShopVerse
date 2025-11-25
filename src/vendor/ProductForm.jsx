
import React, { useState, useCallback, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../utils/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { useDropzone } from "react-dropzone";

export default function ProductForm({ existing = null, onSaved = () => {} }) {
  const [user] = useAuthState(auth);
  const [name, setName] = useState(existing?.name || "");
  const [price, setPrice] = useState(existing?.price || 0);
  const [stock, setStock] = useState(existing?.stock || 0);
  const [tags, setTags] = useState((existing?.tags || []).join(", "));
  const [description, setDescription] = useState(existing?.description || "");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // Reset file if editing and existing image exists
  useEffect(() => {
    if (existing && existing.imageUrl) setFile(null);
  }, [existing]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles[0]) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  async function save() {
    if (!user) return alert("Login as vendor to add product");
    setSaving(true);
    try {
      let imagePath = existing?.imagePath || null;
      let imageUrl = existing?.imageUrl || null;

      if (file) {
        const path = `products/${user.uid}/${Date.now()}_${file.name}`;
        const r = ref(storage, path);
        await uploadBytes(r, file);
        imageUrl = await getDownloadURL(r);
        imagePath = path;
      }

      const payload = {
        name,
        price: Number(price),
        stock: Number(stock),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        description,
        vendorId: user.uid,
        vendorName: user.displayName || user.email,
        imageUrl,
        imagePath,
        createdAt: existing?.createdAt || serverTimestamp(),
        sales: existing?.sales || 0,
        rating: existing?.rating || 0,
      };

      if (existing) {
        await updateDoc(doc(db, "products", existing.id), payload);
      } else {
        await addDoc(collection(db, "products"), payload);
      }

      onSaved();
    } catch (e) {
      console.error(e);
      alert("Error saving product: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="mb-3 font-semibold">{existing ? "Edit product" : "Add new product"}</h3>

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="flex gap-2 mb-2">
        <input
          type="number"
          className="flex-1 p-2 border rounded"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          className="w-32 p-2 border rounded"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div {...getRootProps()} className="p-4 mb-3 border rounded text-center cursor-pointer bg-gray-50">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>Drag 'n' drop product image here, or click to select</p>
        )}
      </div>

      {/* Image Preview */}
      {(file || existing?.imageUrl) && (
        <img
          src={file ? URL.createObjectURL(file) : existing.imageUrl}
          alt="Product"
          className="w-32 h-32 object-cover rounded mb-3"
        />
      )}

      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          {saving ? "Saving..." : "Save product"}
        </button>
      </div>
    </div>
  );
}
