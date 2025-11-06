import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { mailReducer, initialMailState } from "../reducers/mailReducer";
import ComposeMail from "./ComposeMail";

const Inbox = () => {
  const [state, dispatch] = useReducer(mailReducer, initialMailState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCompose, setShowCompose] = useState(false);

  const userEmail = localStorage.getItem("email");

  const cleanEmail = (email) => email?.replace(/[@.]/g, "_");

  // 🔹 Fetch inbox mails
  useEffect(() => {
    const fetchMails = async () => {
      const userKey = cleanEmail(userEmail);
      const url = `https://react-http-1c2c7-default-rtdb.asia-southeast1.firebasedatabase.app/mails/${userKey}/inbox.json`;

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
        setError("❌ Could not load mails.");
      } finally {
        setLoading(false);
      }
    };
    fetchMails();
  }, [userEmail]);

  // 🔹 Mark mail as read
  const markAsRead = async (mailId) => {
    const mail = state.mails.find((m) => m.id === mailId);
    if (!mail.read) {
      const userKey = cleanEmail(userEmail);
      try {
        await axios.patch(
          `https://react-http-1c2c7-default-rtdb.asia-southeast1.firebasedatabase.app/mails/${userKey}/inbox/${mailId}.json`,
          { read: true }
        );
        dispatch({ type: "MARK_AS_READ", payload: mailId });
      } catch (err) {
        console.error("Error marking mail as read:", err);
      }
    }
    dispatch({ type: "SELECT_MAIL", payload: mail });
  };

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
        <h3>📥 Inbox ({state.unreadCount} unread)</h3>
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
        <p style={{ textAlign: "center" }}>Loading mails...</p>
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
            <strong>From:</strong> {state.selectedMail.from}
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
            onClick={() => markAsRead(mail.id)}
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #ccc",
              padding: "10px 0",
              cursor: "pointer",
              background: mail.read ? "#fff" : "#eef4ff",
            }}
          >
            {!mail.read && (
              <div
                style={{
                  height: "10px",
                  width: "10px",
                  borderRadius: "50%",
                  backgroundColor: "blue",
                  marginRight: "10px",
                }}
              ></div>
            )}
            <div>
              <p>
                <strong>{mail.subject}</strong>
              </p>
              <p style={{ color: "gray", fontSize: "14px" }}>
                From: {mail.from}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Inbox;
