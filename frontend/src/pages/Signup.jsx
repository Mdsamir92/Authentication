import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate,Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig"; // adjust path



function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  // ✅ Validation function
  const validateForm = () => {
    const { email, password, mobile } = formData;

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    // Password check (min 6 chars)
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    // Mobile check (10 digits only)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      toast.error("Mobile number must be 10 digits");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if validation fails

    setLoading(true);


    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );

      toast.success("Signup successful! 🎉");
      console.log("API Response:", response.data);

          // Reset form
          setFormData({
            username: "",
            email: "",
            password: "",
            mobile: "",
            role: "",
          });

          // Redirect to login after 2s
          setTimeout(() => {
            navigate("/login");
          }, 2000);

  
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
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
    <div className="flex justify-center  items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl my-4 p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400 pr-10"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 cursor-pointer text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            required
          />
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            required
          >
            <option value="">Select role</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="deliveryBoy">Delivery Boy</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
        {/* OR Divider */}
<div className="flex items-center gap-3 my-4">
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
  <span className="text-gray-700 font-medium">Signup with Google</span>
</button>

        {/* Signup Link */}
        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
