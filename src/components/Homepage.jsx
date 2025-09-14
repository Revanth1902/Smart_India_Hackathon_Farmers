import React, { useState } from "react";
import { Send, Mic } from "@mui/icons-material";
import "../styles/ChatPage.css";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Okay, let's talk coconut sprays! To give you the best recommendation, I need a little more information. Tell me:  
**What problem are you seeing?** (e.g., pests, diseases, nutrient deficiency)  
**What is the age of the coconut tree?**  

**However, here are some common sprays used for coconut trees and their general purpose:**  

- **Neem Oil:** A good all-around organic option for controlling many pests (like mites, scales, and caterpillars) and some fungal diseases.  
- **Bordeaux Mixture:** A classic fungicide used to prevent and control fungal diseases like bud rot and leaf spot.  
- **Specific Insecticides/Fungicides:** If you have a specific pest or disease identified, there are many targeted chemical sprays available. **Always follow the instructions on the label carefully!**  
- **Nutrient Sprays:** If your trees are lacking certain nutrients (like Boron or Magnesium), you can use foliar sprays to help them absorb these nutrients quickly.  

**Important Considerations:**  
- Always read and follow the instructions on the product label.  
- Wear appropriate safety gear (gloves, mask, eye protection) when spraying.  
- Spray in the early morning or late evening to avoid the hottest part of the day.  
- Consider the weather: Don’t spray if rain is expected soon.  

Once you tell me more about the problem you are facing, I can give you a more specific recommendation!`,
    },
    {
      sender: "user",
      text: "What spray should do for coconut",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header">
        <div className="logo">🌱 KRISHI SAKHI</div>
        <div className="lang-dropdown">
          <select>
            <option>English</option>
            <option>हिंदी</option>
            <option>తెలుగు</option>
          </select>
        </div>
      </header>

      <p className="subtext">
        Ask anything about farming, crops, weather, or government schemes
      </p>

      {/* Chat Box */}
      <main className="chat-box">
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
      </main>

      {/* Input Area */}
      <footer className="chat-input">
        <input
          type="text"
          placeholder="Type your farming question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Mic className="icon mic" />
        <button onClick={handleSend} className="send-btn">
          <Send />
        </button>
      </footer>

      {/* Footer Badge */}
      <div className="footer-badge">⚡ Made with Emergent</div>
    </div>
  );
};

export default ChatPage;
