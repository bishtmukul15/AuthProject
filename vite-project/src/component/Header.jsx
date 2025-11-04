import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "15px",
        background: "#007bff",
      }}
    >
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        Home
      </Link>
      <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>
        Sign Up
      </Link>
      <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
        Login
      </Link>
      <Link to="/compose">Compose Mail</Link>
    </div>
  );
};

export default Header;
