import React from "react";

const Home = () => {
  const email = localStorage.getItem("email");
  return (
    <div>
      <div
        style={{
          textAlign: "center",
          paddingTop: "200px",
          fontSize: "24px",
          color: "#333",
        }}
      >
        <h2>Welcome to your mailbox 📬</h2>
        <p>{email ? `Logged in as: ${email}` : "Guest user"}</p>
      </div>
    </div>
  );
};

export default Home;
