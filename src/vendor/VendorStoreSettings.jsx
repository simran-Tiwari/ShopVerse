
import React, { useState, useEffect } from "react";
import { auth, db } from "../utils/firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function VendorStoreSettings() {
  const [themeColor, setThemeColor] = useState("#4f46e5");
  const [bannerUrl, setBannerUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Load current settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "vendors", auth.currentUser.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.themeColor) setThemeColor(data.themeColor);
        if (data.bannerUrl) setBannerUrl(data.bannerUrl);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "vendors", auth.currentUser.uid), {
        themeColor,
        bannerUrl,
      });
      alert("Store settings saved!");
    } catch (e) {
      console.error(e);
      alert("Error saving settings: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Store Customization</h2>

      <label className="block mb-1 font-medium">Theme Color</label>
      <input
        type="color"
        className="w-full h-10 mb-4 cursor-pointer"
        value={themeColor}
        onChange={(e) => setThemeColor(e.target.value)}
      />

      <label className="block mb-1 font-medium">Banner Image URL</label>
      <input
        className="border p-2 w-full mb-4"
        placeholder="Enter URL"
        value={bannerUrl}
        onChange={(e) => setBannerUrl(e.target.value)}
      />

      {bannerUrl && (
        <div className="mb-4">
          <img
            src={bannerUrl}
            alt="Banner preview"
            className="w-full h-32 object-cover rounded border"
          />
        </div>
      )}

      <button
        onClick={saveSettings}
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-indigo-600"
        }`}
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
