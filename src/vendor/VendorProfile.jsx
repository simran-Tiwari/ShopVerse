

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../utils/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function VendorProfile() {
  const [user] = useAuthState(auth);
  const [vendor, setVendor] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch vendor data
  useEffect(() => {
    if (!user) return;
    const dref = doc(db, "vendors", user.uid);
    const unsub = onSnapshot(dref, snap => setVendor(snap.data()));
    return () => unsub();
  }, [user]);

  // Show preview when file is selected
  useEffect(() => {
    if (!logoFile) return setLogoPreview(null);
    const reader = new FileReader();
    reader.onload = e => setLogoPreview(e.target.result);
    reader.readAsDataURL(logoFile);
  }, [logoFile]);

  async function save() {
    if (!user) return;
    setSaving(true);
    try {
      const dref = doc(db, "vendors", user.uid);
      const updates = {};

      if (logoFile) {
        const path = `vendorLogos/${user.uid}_${Date.now()}_${logoFile.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, logoFile);
        updates.logoUrl = await getDownloadURL(storageRef);
        updates.logoPath = path;
      }

      await updateDoc(dref, updates);
      alert("Profile updated successfully!");
      setLogoFile(null);
    } catch (e) {
      console.error(e);
      alert("Error saving profile: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  if (!vendor) return <div className="p-6 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 space-y-4 mt-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Vendor Profile</h2>

      <div className="flex flex-col items-center gap-4">
        <img
          src={logoPreview || vendor.logoUrl || "https://via.placeholder.com/100"}
          alt="Vendor Logo"
          className="w-28 h-28 object-cover rounded-full border"
        />
        <input
          type="file"
          onChange={e => setLogoFile(e.target.files[0])}
          className="mt-2"
        />
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Shop Name:</span>
          <span>{vendor.shopName || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Owner:</span>
          <span>{vendor.vendorName || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">GST:</span>
          <span>{vendor.gst || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Email:</span>
          <span>{vendor.email || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}
