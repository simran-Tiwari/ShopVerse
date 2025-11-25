
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { auth, db } from "./utils/firebase";
import { doc, getDoc } from "firebase/firestore";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import AuthUserLogin from "./pages/AuthUserLogin";
import AuthUserRegister from "./pages/AuthUserRegister";
import AuthVendorLogin from "./pages/AuthVendorLogin";
import AuthVendorRegister from "./pages/AuthVendorRegister";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";
import OrderTrack from "./pages/OrderTrack";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import NotificationsPage from "./pages/Notifications";
import Cart from "./pages/Cart";
import BadgeDashboard from "./pages/BadgeDashboard";
import Leaderboard from "./pages/Leaderboard";
import ProductDetails from "./pages/ProductDetails";

import VendorDashboard from "./pages/VendorDashboard";
import VendorProfile from "./vendor/VendorProfile";
import InventoryTable from "./vendor/InventoryTable";
import SalesAnalytics from "./vendor/SalesAnalytics";
import VendorStoreSettings from "./vendor/VendorStoreSettings";
import VendorChat from "./vendor/VendorChat";

import NavBar from "./components/Navbar";
import NotificationPrompt from "./components/NotificationPrompt";
import RewardToast from "./components/RewardToast";
import BadgePopup from "./components/BadgePopup";
import BadgeListener from "./components/BadgeListener";
import ProtectedRoute from "./utils/ProtectedRoute";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [latestReward, setLatestReward] = useState(null);
  const [latestBadge, setLatestBadge] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const type = snap.data().userType?.trim().toLowerCase();
          setUserType(type);
          localStorage.setItem("role", type);
        }
      } else {
        setCurrentUser(null);
        setUserType(null);
        localStorage.removeItem("role");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar currentUser={currentUser} userType={userType} />

      <main className="max-w-6xl mx-auto p-6">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop setLatestReward={setLatestReward} setLatestBadge={setLatestBadge} />} />
          <Route path="/cart" element={<Cart setLatestReward={setLatestReward} setLatestBadge={setLatestBadge} />} />
          <Route path="/auth-user-login" element={<AuthUserLogin />} />
          <Route path="/auth-user-register" element={<AuthUserRegister />} />
          <Route path="/auth-vendor-login" element={<AuthVendorLogin />} />
          <Route path="/auth-vendor-register" element={<AuthVendorRegister />} />

          {/* User Pages */}
          <Route
            path="/profile"
            element={<ProtectedRoute role="user" currentUser={currentUser} userType={userType}><Profile /></ProtectedRoute>}
          />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/checkout" element={<Checkout setLatestReward={setLatestReward} setLatestBadge={setLatestBadge} />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/order-track/:orderId" element={<OrderTrack />} />
          <Route path="/product/:id" element={<ProductDetails setLatestReward={setLatestReward} setLatestBadge={setLatestBadge} />} />

          {/* Vendor Pages */}
          <Route
            path="/vendor"
            element={<ProtectedRoute role="vendor" currentUser={currentUser} userType={userType}><VendorDashboard /></ProtectedRoute>}
          />
          <Route
            path="/vendor-profile"
            element={<ProtectedRoute role="vendor" currentUser={currentUser} userType={userType}><VendorProfile /></ProtectedRoute>}
          />
          <Route
            path="/vendor/inventory"
            element={<ProtectedRoute role="vendor" currentUser={currentUser} userType={userType}><InventoryTable /></ProtectedRoute>}
          />
          <Route
            path="/vendor/analytics"
            element={<ProtectedRoute role="vendor" currentUser={currentUser} userType={userType}><SalesAnalytics /></ProtectedRoute>}
          />
          <Route
            path="/vendor/store-settings"
            element={<ProtectedRoute role="vendor" currentUser={currentUser} userType={userType}><VendorStoreSettings /></ProtectedRoute>}
          />
          <Route
            path="/vendor/chat"
            element={<ProtectedRoute role="vendor" currentUser={currentUser} userType={userType}><VendorChat /></ProtectedRoute>}
          />

          {/* Badges & Leaderboard */}
          <Route path="/badges" element={<BadgeDashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>

      {/* Reward & Badge Notifications */}
      {latestReward && <RewardToast title={latestReward.title} message={latestReward.message} onClose={() => setLatestReward(null)} />}
      {latestBadge && <BadgePopup badgeId={latestBadge} />}

      {/* Listeners */}
      <BadgeListener setLatestBadge={setLatestBadge} />
      <NotificationPrompt />
    </div>
  );
}
