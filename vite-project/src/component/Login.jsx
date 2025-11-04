import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCAUH6t36-km79JywjWzXvpPlXy-iTqbMs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      // ✅ Save token to localStorage
      localStorage.setItem("token", data.idToken);
      localStorage.setItem("email", data.email);

      setSuccess("Login successful!");
      console.log("User logged in successfully:", data);

      // ✅ Redirect to Welcome page
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error("Login Error:", err.message);
      if (err.message === "INVALID_PASSWORD")
        setError("Incorrect password. Try again.");
      else if (err.message === "EMAIL_NOT_FOUND")
        setError("Email not found. Please sign up first.");
      else setError("Login failed. Try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          width: "350px",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Login</h3>

        {error && (
          <p style={{ color: "red", textAlign: "center", fontWeight: "500" }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: "green", textAlign: "center", fontWeight: "500" }}>
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
