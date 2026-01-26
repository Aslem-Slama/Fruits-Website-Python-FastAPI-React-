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
    <div>
      <div>{aiText}</div>
      <input
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") send();
        }}
      />
        <button onClick={send}>Send</button>
    </div>
  );
}