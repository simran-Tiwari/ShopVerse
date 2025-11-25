

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineBuildingOffice,
} from "react-icons/hi2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function AuthVendorRegister() {
  const navigate = useNavigate();

  const [shopName, setShopName] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [gst, setGst] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setMsg("");

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      await setDoc(doc(db, "users", uid), {
        email,
        vendorName,
        role: "vendor",
      });

      await setDoc(doc(db, "vendors", uid), {
        shopName,
        vendorName,
        gst: gst || "N/A",
        email,
        vendorId: uid,
        themeColor: "#4f46e5",
        bannerUrl: "",
        createdAt: new Date(),
      });

      setMsg("Vendor registered successfully!");
      setTimeout(() => navigate("/auth-vendor-login"), 1200);
    } catch (err) {
      setMsg("Registration failed: " + err.message);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #f0f4f8, #e0f7fa)", // soft e-commerce gradient
      }}
    >
      {/* MAIN CARD */}
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Vendor Registration
        </h2>

        {msg && (
          <p
            className={`text-center p-2 mb-4 rounded ${
              msg.toLowerCase().includes("success")
                ? "bg-green-200 text-green-900"
                : "bg-red-200 text-red-900"
            }`}
          >
            {msg}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <HiOutlineBuildingOffice className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Shop Name"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <HiOutlineUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Vendor Name"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              required
            />
          </div>

          <input
            type="text"
            placeholder="GST Number (optional)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
            value={gst}
            onChange={(e) => setGst(e.target.value)}
          />

          <div className="relative">
            <HiOutlineEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <HiOutlineLockClosed className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already registered?{" "}
          <Link
            to="/auth-vendor-login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
