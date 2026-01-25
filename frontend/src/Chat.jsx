import { useState, useEffect } from "react";
export default function Chat() {
  const [aiText, setAiText] = useState("");
  const [userText, setUserText] = useState("");

  async function send() {
      const msg = userText.trim();
       if (!msg) return;
       setAiText("");
       setUserText("");

      const res = await fetch("http://localhost:8000/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg}),
    });

      const data = await res.json();
      setAiText(data.reply);

  }


  useEffect(() => {
  fetch("http://localhost:8000/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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