import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";

const ComposeMail = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [status, setStatus] = useState("");

  const senderEmail = localStorage.getItem("email"); // sender email

  // Convert editor content to HTML before sending
  const getMessageHtml = () => {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus("");

    const message = getMessageHtml();

    if (!to || !subject || !message.trim()) {
      setStatus("❌ All fields are required.");
      return;
    }

    // Clean email for Firebase (remove . and @)
    const cleanEmail = (email) => email.replace(/[@.]/g, "_");

    const senderKey = cleanEmail(senderEmail);
    const receiverKey = cleanEmail(to);

    const mailData = {
      from: senderEmail,
      to,
      subject,
      message, // HTML content
      date: new Date().toISOString(),
      read: false,
    };

    try {
      // Save to sender’s "sent" folder
      await axios.post(
        `https://react-http-1c2c7-default-rtdb.asia-southeast1.firebasedatabase.app/mails/${senderKey}/sent.json`,
        mailData
      );

      // Save to receiver’s "inbox" folder
      await axios.post(
        `https://react-http-1c2c7-default-rtdb.asia-southeast1.firebasedatabase.app/mails/${receiverKey}/inbox.json`,
        mailData
      );

      setStatus("✅ Mail sent successfully!");
      setTo("");
      setSubject("");
      setEditorState(EditorState.createEmpty());
    } catch (err) {
      console.error("Error sending mail:", err);
      setStatus("❌ Failed to send mail. Try again.");
    }
  };

  return (
    <div
      style={{
        width: "60%",
        margin: "50px auto",
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
        📧 Compose Mail
      </h3>

      {status && (
        <p
          style={{
            textAlign: "center",
            color: status.startsWith("✅") ? "green" : "red",
          }}
        >
          {status}
        </p>
      )}

      <form onSubmit={handleSend}>
        <input
          type="email"
          placeholder="Recipient Email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            minHeight: "200px",
            marginBottom: "20px",
            padding: "10px",
          }}
        >
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            toolbar={{
              options: ["inline", "list", "textAlign", "link", "history"],
              inline: {
                options: ["bold", "italic", "underline", "strikethrough"],
              },
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          Send Mail
        </button>
      </form>
    </div>
  );
};

export default ComposeMail;
