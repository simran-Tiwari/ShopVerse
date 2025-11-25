
import React, { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;

      if (!user) {
        navigate("/auth-user-login"); // redirect if not logged in
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().role === "user") {
          setProfile(docSnap.data());
        } else {
          navigate("/auth-user-login"); // redirect if role is not "user"
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Avatar & Welcome */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center text-white text-2xl font-bold">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome, {profile.name || "User"}!
          </h2>
        </div>

        {/* Profile Details */}
        <div className="space-y-2 text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>{profile.name || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Points:</span>
            <span>{profile.points ?? 0}</span>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={async () => {
              await signOut(auth);
              navigate("/auth-user-login");
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
