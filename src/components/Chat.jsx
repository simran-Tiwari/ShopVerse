import React, { useEffect, useRef, useState } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Chat({ chatId }) {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [uploadState, setUploadState] = useState(null);
  const fileRef = useRef();
  const bottomRef = useRef();

  useEffect(() => {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    if (!text && !(fileRef.current && fileRef.current.files.length)) return;

    let fileMeta = null;

    if (fileRef.current && fileRef.current.files.length) {
      const f = fileRef.current.files[0];
      const path = `chatFiles/${chatId}/${Date.now()}_${f.name}`;
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, f);

      setUploadState({ status: "uploading", pct: 0, name: f.name });

      uploadTask.on(
        "state_changed",
        snapshot => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadState({ status: "uploading", pct, name: f.name });
        },
        err => {
          console.error(err);
          setUploadState({ status: "error" });
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          fileMeta = { name: f.name, url, path: uploadTask.snapshot.ref.fullPath };
          setUploadState({ status: "done", pct: 100, name: f.name });
          await addDoc(collection(db, "chats", chatId, "messages"), {
            text,
            file: fileMeta,
            uid: user?.uid || null,
            createdAt: serverTimestamp()
          });
          setText("");
          fileRef.current.value = null;
          setUploadState(null);
        }
      );

      return;
    }

    // plain text message
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      uid: user?.uid || null,
      createdAt: serverTimestamp()
    });
    setText("");
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col h-full">
      <div className="flex-1 overflow-auto mb-3 space-y-3 max-h-96">
        {messages.map(m => (
          <div
            key={m.id}
            className={`p-2 rounded-lg ${
              m.uid === user?.uid ? "bg-indigo-50 text-right self-end" : "bg-gray-50 text-left"
            }`}
          >
            {m.text && <div className="text-gray-800">{m.text}</div>}
            {m.file && (
              <div className="mt-2">
                <a href={m.file.url} target="_blank" rel="noreferrer" className="underline text-indigo-600 text-sm">
                  {m.file.name}
                </a>
                <div className="text-xs text-gray-500">{(m.file.size / 1024).toFixed(1)} KB</div>
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1">
              {new Date(m.createdAt?.toDate?.() || Date.now()).toLocaleString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {uploadState && uploadState.status === "uploading" && (
        <div className="mb-2">
          <div className="text-sm mb-1">
            Uploading {uploadState.name}: {uploadState.pct}%
          </div>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div className="bg-indigo-600 h-2 rounded" style={{ width: `${uploadState.pct}%` }} />
          </div>
        </div>
      )}

      <form onSubmit={send} className="flex gap-2 items-center">
        <input
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <input type="file" ref={fileRef} className="text-sm" />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
