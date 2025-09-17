import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, AttachFile } from "@mui/icons-material";
import "../styles/ChatPage.css";

const ChatPage = () => {
  const messagesEndRef = useRef(null);

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
- **Bordeaux Mixture:** A classic fungicide used to prevent and control fungal diseases like bud rot and leaf spot.  
- **Specific Insecticides/Fungicides:** If you have a specific pest or disease identified, there are many targeted chemical sprays available. **Always follow the instructions on the label carefully!**  
`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setIsLoading(true);

    // Add loading message
    const loadingMessage = { sender: "bot", text: "..." };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await fetch(
        "https://apiforchatsihfarmers.onrender.com/webhook",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            queryResult: {
              queryText: input,
            },
          }),
        }
      );

      const data = await response.json();
      const botReply =
        data.fulfillmentText || "Sorry, I didn't understand that.";

      // Replace loading with bot reply
      setMessages((prev) => [
        ...prev.slice(0, -1), // remove last loading message
        { sender: "bot", text: botReply },
      ]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: "Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text === "..." ? (
              <div className="loading-dots" aria-label="Bot is typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              msg.text.split("\n").map((line, i) => <p key={i}>{line}</p>)
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-bar">
        <input
          type="text"
          placeholder="Type your farming question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
          aria-label="Chat input"
        />
        <label className="icon attach" aria-label="Attach file">
          <AttachFile />
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => console.log("File selected:", e.target.files[0])}
            disabled={isLoading}
          />
        </label>
        <Mic className="icon mic" aria-label="Voice input" />
        <button
          onClick={handleSend}
          className="send-btn"
          disabled={isLoading}
          aria-label="Send message"
        >
          <Send />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
