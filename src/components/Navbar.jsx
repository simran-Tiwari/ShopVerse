

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebase";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import shopverseLogo from "../assets/shopVerseLogo.png";

export default function Navbar({ currentUser }) {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [notifCount, setNotifCount] = useState(0);
  const [badgeCount, setBadgeCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      setUserRole(null);
      setUserName("");
      return;
    }

    let unsubNotifications = () => {};
    let unsubBadges = () => {};

    const fetchRoleAndSubscribe = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const role = snap.data().role || snap.data().userType || "";
          setUserRole(role.toLowerCase());
          setUserName(snap.data().name || "");

          const notifCol = collection(db, "users", currentUser.uid, "notifications");
          unsubNotifications = onSnapshot(notifCol, (snapshot) => {
            setNotifCount(snapshot.docs.length);
          });

          const badgeCol = collection(db, "users", currentUser.uid, "badges");
          unsubBadges = onSnapshot(badgeCol, (snapshot) => {
            setBadgeCount(snapshot.docs.length);
          });
        }
      } catch (err) {
        console.error("Error fetching user role or subscriptions:", err);
      }
    };

    fetchRoleAndSubscribe();

    return () => {
      unsubNotifications();
      unsubBadges();
    };
  }, [currentUser]);

  const handleLogout = async () => {
    await auth.signOut();
    setUserRole(null);
    navigate("/");
  };

  const linkClass =
    "px-4 py-2 rounded-lg transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Shopverse */}
          <Link to="/" className="flex items-center gap-2">
            <img src={shopverseLogo} alt="Shopverse Logo" className="h-10 w-auto" />
            <span className="font-bold text-2xl text-indigo-600 hover:text-indigo-800 transition-colors">
              Shopverse
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-3">
            {userRole === "user" && (
              <>
                <Link to="/shop" className={linkClass}>Shop</Link>
                <Link to="/wishlist" className={linkClass}>Wishlist ({wishlistItems?.length || 0})</Link>
                <Link to="/cart" className={linkClass}>Cart ({cartItems?.length || 0})</Link>
                <Link to="/orders" className={linkClass}>Orders</Link>
                <Link to="/notifications" className={linkClass}>Notifications ({notifCount})</Link>
                <Link to="/badges" className={linkClass}>Badges</Link> {/* Removed count */}
                <Link to="/profile" className={linkClass}>{userName || "Profile"}</Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            )}

            {userRole === "vendor" && (
              <>
                <Link to="/vendor" className={linkClass}>Dashboard</Link>
                <Link to="/vendor-profile" className={linkClass}>Profile</Link>
                <Link to="/vendor/inventory" className={linkClass}>Inventory</Link>
                <Link to="/vendor/analytics" className={linkClass}>Analytics</Link>
                <Link to="/vendor/store-settings" className={linkClass}>Store Settings</Link>
                <Link to="/vendor/chat" className={linkClass}>Chat</Link>
                <Link to="/notifications" className={linkClass}>Notifications ({notifCount})</Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            )}

            {!userRole && (
              <>
                <Link to="/auth-user-login" className={linkClass}>User Login</Link>
                <Link to="/auth-user-register" className={linkClass}>User Register</Link>
                <Link to="/auth-vendor-login" className={linkClass}>Vendor Login</Link>
                <Link to="/auth-vendor-register" className={linkClass}>Vendor Register</Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pt-2 pb-4 flex flex-col gap-2">
          {userRole === "user" && (
            <>
              <Link to="/shop" className={linkClass}>Shop</Link>
              <Link to="/wishlist" className={linkClass}>Wishlist ({wishlistItems?.length || 0})</Link>
              <Link to="/cart" className={linkClass}>Cart ({cartItems?.length || 0})</Link>
              <Link to="/orders" className={linkClass}>Orders</Link>
              <Link to="/notifications" className={linkClass}>Notifications ({notifCount})</Link>
              <Link to="/badges" className={linkClass}>Badges</Link> {/* Removed count */}
              <Link to="/profile" className={linkClass}>{userName || "Profile"}</Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
              >
                Logout
              </button>
            </>
          )}

          {userRole === "vendor" && (
            <>
              <Link to="/vendor" className={linkClass}>Dashboard</Link>
              <Link to="/vendor-profile" className={linkClass}>Profile</Link>
              <Link to="/vendor/inventory" className={linkClass}>Inventory</Link>
              <Link to="/vendor/analytics" className={linkClass}>Analytics</Link>
              <Link to="/vendor/store-settings" className={linkClass}>Store Settings</Link>
              <Link to="/vendor/chat" className={linkClass}>Chat</Link>
              <Link to="/notifications" className={linkClass}>Notifications ({notifCount})</Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
              >
                Logout
              </button>
            </>
          )}

          {!userRole && (
            <>
              <Link to="/auth-user-login" className={linkClass}>User Login</Link>
              <Link to="/auth-user-register" className={linkClass}>User Register</Link>
              <Link to="/auth-vendor-login" className={linkClass}>Vendor Login</Link>
              <Link to="/auth-vendor-register" className={linkClass}>Vendor Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
