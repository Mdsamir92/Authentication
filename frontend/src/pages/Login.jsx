import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig"; // adjust path

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signin", // 👈 Your backend login API
        formData
      );

      toast.success("Login successful! 🎉");
      // (Optional) Save full user object
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Optionally store token (if backend sends it)
      localStorage.setItem("token", response.data.token);

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };



  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;
      console.log("Google User:", user);

      // optional: get Firebase ID token if you want to send it to backend
      const token = await user.getIdToken();

      // store locally
      localStorage.setItem("user", JSON.stringify(user));

      alert(`Welcome ${user.displayName}!`);
      navigate("/");
    } catch (error) {
      console.error("Google Sign-in Error:", error.code, error.message);
      alert("Failed to login with Google");
    }
  };



  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-200 transition-all duration-300 hover:shadow-3xl"
      >
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold shadow-md">
            L
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mt-4">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">Login to continue</p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition pr-12"
            placeholder="Enter your password"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-10 cursor-pointer text-gray-500 hover:text-gray-700 transition"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="mb-6">
          <Link
            to="/reset"
            className="font-medium  text-blue-600 hover:text-blue-700 hover:underline transition"
          >
            Forgot Password
          </Link>

        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer  w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        {/* Signup with Google */}
        <button
          type="button"
          onClick={handleGoogleSignup} // <-- create this function
          className="w-full cursor-pointer flex items-center justify-center gap-3 border border-gray-300 bg-white py-2 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <FcGoogle size={20} />
          <span className="text-gray-700 font-medium">SignIn with Google</span>
        </button>

        {/* Signup Link */}
        <p className="text-center mt-3 text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
