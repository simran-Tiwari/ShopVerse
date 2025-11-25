import React from "react";

export default function ChatFilePreview({ file, onCancel }) {
  if (!file) return null;
  const isImage = file.type?.startsWith("image/");

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 shadow-sm mb-2 hover:bg-gray-100 transition">
      {isImage ? (
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          className="w-16 h-16 object-cover rounded-lg border"
        />
      ) : (
        <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg border">
          <span className="text-sm font-semibold">{file.name.split(".").pop()}</span>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center">
        <div className="font-medium text-gray-800">{file.name}</div>
        <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
      </div>

      <button
        onClick={onCancel}
        className="text-red-600 font-medium text-sm hover:underline transition"
      >
        Remove
      </button>
    </div>
  );
}
