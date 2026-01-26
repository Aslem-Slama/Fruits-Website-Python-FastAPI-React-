import { useState, useEffect } from "react";
export default function Chat() {
  const [aiText, setAiText] = useState("");
  const [userText, setUserText] = useState("");

  const sessionId =
  sessionStorage.getItem("chat_session_id") ||
  (sessionStorage.setItem("chat_session_id", crypto.randomUUID()),
   sessionStorage.getItem("chat_session_id"));


  async function send() {
      const msg = userText.trim();
       if (!msg) return;
       setAiText("");
       setUserText("");

      const res = await fetch("http://localhost:8000/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json",
      "X-Session-Id": sessionId},
      body: JSON.stringify({ message: msg}),
    });

      const data = await res.json();
      setAiText(data.reply);

      window.location.reload();
  }


  useEffect(() => {
  fetch("http://localhost:8000/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json",
    "X-Session-Id": sessionId},
    body: JSON.stringify({ message: ""}),
  })
    .then((res) => res.json())
    .then((data) => {
      setAiText(data.reply);
    });
}, []);



  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🍳 Cooking Assistant</h3>
      <div style={styles.message}>{aiText}</div>
      <input
        style={styles.input}
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") send();
        }}
        placeholder="Type your message..."
      />
      <button style={styles.button} onClick={send}>
        Send
      </button>
    </div>
  );
}

const styles = {
  card: {
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "800px",        // ← ADD THIS (limits width)
    margin: "20px auto",      // ← CHANGE THIS (centers it with margins)
  },
  title: {
    margin: "0 0 15px 0",
    color: "#333",
  },
  message: {
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    marginBottom: "15px",
    height: "150px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    color: "#333",
    border: "1px solid #e0e0e0",
  },
  input: {
    width: "100%",
    padding: "15px",
    fontSize: "16px",
    border: "2px solid #e0e0e0",
    borderRadius: "25px",
    outline: "none",
    marginBottom: "10px",
    boxSizing: "border-box",
    backgroundColor: "white",
    color: "#333",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
  },
};