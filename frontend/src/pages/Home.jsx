import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Convert string → object
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout API
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "GET",
        credentials: "include", // in case you are using cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // Clear user from localStorage
        localStorage.removeItem("user");
        setUser(null);

        // Redirect to login page
        navigate("/login");
      } else {
        console.error("Logout failed:", await res.json());
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Home Page</h1>

      {user ? (
        <div className="bg-white p-6 rounded-xl shadow-lg w-80">
          <h2 className="text-xl font-semibold mb-2">User Details</h2>
          <p>
            <strong>Profile pic:</strong>{" "}
            <img
              src={user.photoURL}
              alt="profile"
              className="h-44 rounded-md contain"
            />
          </p>
          <p>
            <strong>Username:</strong> {user.username || user.displayName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Mobile:</strong> {user.mobile || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {user.role || "user"}
          </p>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="text-gray-600">No user logged in.</p>
      )}
    </div>
  );
}

export default Home;
