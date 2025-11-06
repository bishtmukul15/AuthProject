import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const BASE_URL =
  "https://react-http-1c2c7-default-rtdb.asia-southeast1.firebasedatabase.app/mails";

const cleanEmail = (email) => email?.replace(/[@.]/g, "_");

export const useMailApi = (
  userEmail,
  folder = "inbox",
  pollInterval = 2000
) => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const previousMailsRef = useRef([]);

  const userKey = cleanEmail(userEmail);

  // 🔹 Fetch Mails
  const fetchMails = useCallback(async () => {
    if (!userEmail) return;
    try {
      const res = await axios.get(`${BASE_URL}/${userKey}/${folder}.json`);
      if (res.data) {
        const formatted = Object.entries(res.data).map(([id, mail]) => ({
          id,
          ...mail,
        }));

        // 🔸 Compare old vs new to avoid unnecessary renders
        const newData = JSON.stringify(formatted);
        const oldData = JSON.stringify(previousMailsRef.current);
        if (newData !== oldData) {
          previousMailsRef.current = formatted;
          setMails(formatted.reverse());
        }
      } else {
        setMails([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("❌ Could not load mails.");
    } finally {
      setLoading(false);
    }
  }, [userEmail, folder]);

  // 🔹 Polling
  useEffect(() => {
    fetchMails();
    const interval = setInterval(fetchMails, pollInterval);
    return () => clearInterval(interval);
  }, [fetchMails, pollInterval]);

  // 🔹 Mark as Read
  const markAsRead = async (mailId) => {
    try {
      await axios.patch(`${BASE_URL}/${userKey}/${folder}/${mailId}.json`, {
        read: true,
      });
      setMails((prev) =>
        prev.map((m) => (m.id === mailId ? { ...m, read: true } : m))
      );
    } catch (err) {
      console.error("Error marking mail as read:", err);
    }
  };

  return { mails, loading, error, markAsRead, refetch: fetchMails };
};
