
import React from "react";
export default function ChatMessage({ msg, isMe }) {
  const ts = msg?.createdAt?.toDate ? msg.createdAt.toDate() : (msg?.createdAt ? new Date(msg.createdAt) : null);

  return (
    <div className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`p-3 rounded-2xl max-w-[75%] wrap-words shadow-sm ${
        isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
      }`}>
        {/* Message text */}
        {msg.text && <div className="whitespace-pre-wrap text-sm">{msg.text}</div>}

        {/* File attachment */}
        {msg.fileUrl && (
          <div className="mt-2">
            <a
              href={msg.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline text-sm font-medium ${
                isMe ? "text-indigo-100 hover:text-white" : "text-indigo-700 hover:text-indigo-900"
              } transition-colors`}
            >
              Open file
            </a>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-[11px] opacity-60 mt-1 text-right">
          {ts ? ts.toLocaleString() : ""}
        </div>
      </div>
    </div>
  );
}
