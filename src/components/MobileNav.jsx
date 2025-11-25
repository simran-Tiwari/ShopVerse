

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function MobileNav({ currentUser, userType, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="md:hidden relative">
      <button onClick={() => setOpen(!open)} className="p-2 border rounded text-white bg-indigo-600">
        Menu
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-2 top-14 bg-white p-4 rounded shadow-md w-48 z-50"
        >
          <Link to="/" className="block py-2" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/shop" className="block py-2" onClick={() => setOpen(false)}>Shop</Link>
          <Link to="/wishlist" className="block py-2" onClick={() => setOpen(false)}>Wishlist</Link>
          <Link to="/orders" className="block py-2" onClick={() => setOpen(false)}>Orders</Link>

          {currentUser && userType === "vendor" && (
            <Link to="/vendor" className="block py-2 text-indigo-600 font-semibold" onClick={() => setOpen(false)}>
              Vendor Dashboard
            </Link>
          )}

          {currentUser ? (
            <button
              className="block w-full text-left py-2 text-red-600"
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/auth-user-login" className="block py-2" onClick={() => setOpen(false)}>User Login</Link>
              <Link to="/auth-user-register" className="block py-2" onClick={() => setOpen(false)}>User Register</Link>
              <Link to="/auth-vendor-login" className="block py-2" onClick={() => setOpen(false)}>Vendor Login</Link>
              <Link to="/auth-vendor-register" className="block py-2" onClick={() => setOpen(false)}>Vendor Register</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
