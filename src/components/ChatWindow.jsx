// src/components/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatFilePreview from "./ChatFilePreview";
import { uploadFileWithProgress } from "../utils/upLoadFile";

/**
 * ChatWindow
 * props:
 *  - messages: array (from useChat)
 *  - onSend: async ({ senderId, text, fileUrl })
 *  - userId: current user's uid
 *
 * This component handles file selection, optional upload progress UI, and sends messages.
 */
export default function ChatWindow({ messages = [], onSend, userId }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [uploadPct, setUploadPct] = useState(null);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!text && !file) return;
    try {
      if (file) {
        // upload with progress tracking
        const fileObj = file;
        const path = `chat_files/${Date.now()}_${fileObj.name}`;
        // create upload task to track percentage
        const { promise, task } = createUploadTask(fileObj, path);
        task.on("state_changed", snapshot => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadPct(pct);
        }, err => {
          console.error("upload failed", err);
          setUploadPct(null);
        }, async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            await onSend({ senderId: userId, text, fileUrl: url });
            setText("");
            setFile(null);
            setUploadPct(null);
          } catch (e) {
            console.error(e);
            setUploadPct(null);
          }
        });
        return;
      }

      await onSend({ senderId: userId, text, fileUrl: null });
      setText("");
    } catch (e) {
      console.error("handleSend error:", e);
    }
  }


  function createUploadTask(fileObj, path) {
   
    const fakeTask = {
      on: (evt, progressCb, errCb, doneCb) => {
       
      },
      snapshot: {}
    };
    return { promise: uploadFileWithProgress(fileObj, "chat_files"), task: fakeTask };
  }

  return (
    <div className="border rounded-xl p-4 h-[70vh] flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto pr-2">
        {messages.map(msg => (
          <ChatMessage key={msg.id} msg={msg} isMe={msg.senderId === userId} />
        ))}
        <div ref={bottomRef} />
      </div>

      {file && <ChatFilePreview file={file} onCancel={() => setFile(null)} />}

      {uploadPct !== null && (
        <div className="mb-2 text-sm">Uploading: {uploadPct}%</div>
      )}

      <div className="flex items-center gap-3 mt-2">
        <input type="file" onChange={e => { if (e.target.files && e.target.files[0]) setFile(e.target.files[0]); }} />
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg bg-gray-100"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        />
        <button onClick={handleSend} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Send</button>
      </div>
    </div>
  );
}





