import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { mailReducer, initialMailState } from "../Reducers/mailReducer";
import ComposeMail from "../pages/ComposeMail";

const SentBox = () => {
  const [state, dispatch] = useReducer(mailReducer, initialMailState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCompose, setShowCompose] = useState(false);

  const userEmail = localStorage.getItem("email");

  const cleanEmail = (email) => email?.replace(/[@.]/g, "_");

  // 🔹 Fetch Sent mails
  useEffect(() => {
    const fetchMails = async () => {
      const userKey = cleanEmail(userEmail);
      const url = `https://react-http-1c2c7-default-rtdb.asia-southeast1.firebasedatabase.app/mails/${userKey}/sent.json`;

      try {
        const res = await axios.get(url);
        if (res.data) {
          const formatted = Object.entries(res.data).map(([id, mail]) => ({
            id,
            ...mail,
          }));
          dispatch({ type: "SET_MAILS", payload: formatted.reverse() });
        } else {
          dispatch({ type: "SET_MAILS", payload: [] });
        }
      } catch (err) {
        console.error(err);
        setError("❌ Could not load sent mails.");
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
        <h3>📤 Sent Mails</h3>
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
        <p style={{ textAlign: "center" }}>Loading sent mails...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : state.selectedMail ? (
        <div>
          <button
            onClick={() => dispatch({ type: "SELECT_MAIL", payload: null })}
            style={{
              marginBottom: "10px",
              background: "#ccc",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            🔙 Back
          </button>
          <h4>{state.selectedMail.subject}</h4>
          <p>
            <strong>To:</strong> {state.selectedMail.to}
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: state.selectedMail.message }}
            style={{
              background: "#f9f9f9",
              padding: "10px",
              borderRadius: "5px",
              marginTop: "10px",
            }}
          ></div>
        </div>
      ) : (
        state.mails.map((mail) => (
          <div
            key={mail.id}
            onClick={() => dispatch({ type: "SELECT_MAIL", payload: mail })}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #ccc",
              padding: "10px 0",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            <div>
              <p>
                <strong>{mail.subject}</strong>
              </p>
              <p style={{ color: "gray", fontSize: "14px" }}>To: {mail.to}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SentBox;
