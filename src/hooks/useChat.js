
import { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../utils/firebase";


export default function useChat(chatId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(list);
    }, err => {
      console.error("useChat onSnapshot error:", err);
    });

    return () => unsub();
  }, [chatId]);

  const sendMessage = useCallback(async ({ senderId, text = "", fileUrl = null }) => {
    if (!chatId) throw new Error("chatId required");
    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        senderId,
        text,
        fileUrl,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("sendMessage error:", e);
      throw e;
    }
  }, [chatId]);

  return { messages, sendMessage };
}
