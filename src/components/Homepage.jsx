import React, { useState } from "react";
import { Send, Mic } from "@mui/icons-material";
import "../styles/ChatPage.css";
import { AttachFile } from "@mui/icons-material";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: "user",
      text: "What spray should do for coconut",
    },
    {
      sender: "bot",
      text: `Okay, let's talk coconut sprays! To give you the best recommendation
**However, here are some common sprays used for coconut trees and their general purpose:**  
- **Neem Oil:** A good all-around organic option for controlling many pests (like mites, scales, and caterpillars) and some fungal diseases.  
- **Bordeaux Mixture:** A classic fungicide used to prevent and control fungal diseases like bud rot and leaf spot.  **Bordeaux Mixture:** A classic fungicide used to prevent and control fungal diseases like bud rot and leaf spot.  
- **Specific Insecticides/Fungicides:** If you have a specific pest or disease identified, there are many targeted chemical sprays available. **Always follow the instructions on the label carefully!**  
`,
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ))}
      </div>

      <div className="chat-input-bar">
        <input
          type="text"
          placeholder="Type your farming question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <label className="icon attach">
          <AttachFile />
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => console.log("File selected:", e.target.files[0])}
          />
        </label>
        <Mic className="icon mic" />
        <button onClick={handleSend} className="send-btn">
          <Send />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
