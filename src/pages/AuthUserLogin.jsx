
import { useState } from "react"; 
import { auth, db } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { HiMail, HiLockClosed } from "react-icons/hi";

export default function AuthUserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "user") {
        setError("This account is not a user account.");
        return;
      }

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(to bottom, #f5f7fa, #c3cfe2)", // soft, e-commerce friendly gradient
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          User Login
        </h2>

        {error && (
          <p className="bg-red-100 text-red-800 p-2 rounded mb-3 text-center shadow-sm">
            {error}
          </p>
        )}

        {success && (
          <p className="bg-green-100 text-green-800 p-2 rounded mb-3 text-center shadow-sm">
            {success}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <HiMail className="absolute top-3 left-3 text-gray-400" />
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
            <HiLockClosed className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-gray-600 font-medium"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-5 text-gray-600">
          New user?{" "}
          <Link
            to="/auth-user-register"
            className="text-blue-500 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
