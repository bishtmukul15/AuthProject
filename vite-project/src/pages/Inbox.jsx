import React, { useEffect, useState } from "react";
import axios from "axios";
import ComposeMail from "./ComposeMail";

const Inbox = () => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCompose, setShowCompose] = useState(false);

  const userEmail = localStorage.getItem("email"); // currently logged-in user's email

  // Clean email for Firebase path
  const cleanEmail = (email) => email?.replace(/[@.]/g, "_");

  // 🔹 Fetch mails on mount
  useEffect(() => {
    const fetchMails = async () => {
      if (!userEmail) {
        setError("⚠️ No user logged in!");
        setLoading(false);
        return;
      }

      const userKey = cleanEmail(userEmail);
      const url = `https://react-http-1c2c7-default-rtdb.asia-southeast1.firebasedatabase.app/mails/${userKey}/inbox.json`;

      try {
        const res = await axios.get(url);
        if (res.data) {
          const mailList = Object.values(res.data).reverse(); // latest first
          setMails(mailList);
        } else {
          setMails([]);
        }
      } catch (err) {
        console.error("Error fetching mails:", err);
        setError("❌ Failed to fetch mails. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, [userEmail]);

  if (showCompose) return <ComposeMail />;

  return (
    <div
      style={{
        width: "70%",
        margin: "40px auto",
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3>📥 Inbox</h3>
        <button
          onClick={() => setShowCompose(true)}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ✍️ Compose
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>📩 Loading mails...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : mails.length === 0 ? (
        <p style={{ textAlign: "center" }}>No mails found.</p>
      ) : (
        mails.map((mail, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #ccc",
              padding: "10px 0",
              cursor: "pointer",
            }}
          >
            <p>
              <strong>From:</strong> {mail.from}
            </p>
            <p>
              <strong>Subject:</strong> {mail.subject}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: mail.message }}
              style={{
                background: "#f9f9f9",
                padding: "10px",
                borderRadius: "5px",
                marginTop: "5px",
              }}
            ></div>
            <small style={{ color: "gray" }}>
              {new Date(mail.date).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default Inbox;
