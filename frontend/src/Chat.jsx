import { useState } from "react";

export default function Chat() {
  const [aiText, setAiText] = useState("");
  const [userText, setUserText] = useState("");

  return (
    <div>
      <div>{aiText}</div>
      <input value={userText} onChange={(e) => setUserText(e.target.value)} />
    </div>
  );
}
