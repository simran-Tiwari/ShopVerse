
import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export default function VendorChat({ chatId }) {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, `chats/${chatId}/messages`), orderBy("createdAt"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !user) return;
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      text,
      senderId: user.uid,
      senderName: user.displayName || user.email,
      createdAt: serverTimestamp(),
    });
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col h-96">
      <h3 className="font-semibold mb-3">Customer Chat</h3>

      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.map(m => (
          <div
            key={m.id}
            className={`p-2 rounded ${m.senderId === user?.uid ? "bg-indigo-100 self-end" : "bg-gray-100 self-start"}`}
          >
            <div className="text-sm font-medium">{m.senderName}</div>
            <div>{m.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
