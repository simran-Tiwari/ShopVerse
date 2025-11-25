import React, { useEffect, useRef, useState } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ChatEnhanced({ chatId }) {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [uploadPct, setUploadPct] = useState(null);
  const bottomRef = useRef();

  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, snap => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => unsub();
  }, [chatId]);

  async function handleSend(e) {
    e?.preventDefault();
    if (!text && !file) return;

    let fileMeta = null;
    if (file) {
      const path = `chat_files/${chatId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        snapshot => setUploadPct(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
        err => console.error(err),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          fileMeta = { name: file.name, url, path: uploadTask.snapshot.ref.fullPath, type: file.type };
          await addDoc(collection(db, "chats", chatId, "messages"), {
            uid: user?.uid,
            text,
            file: fileMeta,
            createdAt: serverTimestamp()
          });
          setText("");
          setFile(null);
          setUploadPct(null);
        }
      );
      return;
    }

    await addDoc(collection(db, "chats", chatId, "messages"), {
      uid: user?.uid,
      text,
      createdAt: serverTimestamp()
    });
    setText("");
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="overflow-auto max-h-80 space-y-2 mb-3">
        {messages.map(m => (
          <div
            key={m.id}
            className={`p-2 rounded-lg ${m.uid === user?.uid ? "bg-indigo-100 ml-auto text-right" : "bg-gray-100 mr-auto text-left"}`}
          >
            {m.text && <div>{m.text}</div>}
            {m.file && (
              <div className="mt-1">
                <a href={m.file.url} target="_blank" rel="noreferrer" className="underline text-indigo-600">{m.file.name}</a>
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1">{new Date(m.createdAt?.toDate?.() || Date.now()).toLocaleString()}</div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {uploadPct !== null && (
        <div className="mb-2">
          <div className="text-sm">Uploading: {uploadPct}%</div>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div className="bg-indigo-600 h-2 rounded" style={{ width: `${uploadPct}%` }} />
          </div>
        </div>
      )}

      <form className="flex gap-2" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button className="bg-indigo-600 text-white px-3 py-1 rounded">Send</button>
      </form>
    </div>
  );
}
