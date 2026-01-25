import { useState } from "react";

export default function Chat() {
  const [aiText, setAiText] = useState("Hi! (frontend only for now)");
  const [userText, setUserText] = useState("");

  function onSend() {
    // For now: just show what the user typed
    setAiText("You wrote: " + userText);
    setUserText("");
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial" }}>
      {/* AI box */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 16,
          minHeight: 120,
          whiteSpace: "pre-wrap",
        }}
      >
        {aiText}
      </div>

      {/* User input + button */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder="Type here..."
        />

        <button
          onClick={onSend}
          style={{
            padding: "12px 18px",
            borderRadius: 8,
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
