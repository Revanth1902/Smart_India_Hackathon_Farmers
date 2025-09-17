import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, AttachFile } from "@mui/icons-material";
import "../styles/ChatPage.css";

const STORAGE_KEY = "chat_messages";
const EXPIRY_DAYS = 30;

const ChatPage = () => {
  const messagesEndRef = useRef(null);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Load messages from localStorage with expiry check
  const loadStoredMessages = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      const now = new Date().getTime();
      if (now - parsed.timestamp > EXPIRY_DAYS * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed.messages;
    } catch {
      return null;
    }
  };

  const [messages, setMessages] = useState(() => {
    const loaded = loadStoredMessages();
    if (loaded && loaded.length) return loaded;
    return [
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
    ];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState(""); // for word-by-word typing animation

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  // Save messages to localStorage on every message change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ messages, timestamp: new Date().getTime() })
    );
  }, [messages]);

  // Animate typing word-by-word for bot messages
  const animateTyping = (fullText) => {
    setTypingText("");
    const words = fullText.split(" ");
    let index = 0;

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setTypingText((prev) => (prev ? prev + " " : "") + words[index]);
        index++;
        if (index === words.length) {
          clearInterval(interval);
          resolve();
        }
      }, 150);
    });
  };
  const handleSend = async () => {
    if (!input.trim() || isLoading || isBotTyping) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setIsLoading(true);

    // Show loading animation
    setMessages((prev) => [...prev, { sender: "bot", text: "..." }]);

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

      setMessages((prev) => [...prev.slice(0, -1)]); // Remove loader
      setIsBotTyping(true); // Lock UI during animation

      await animateTyping(botReply); // Animate text

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      setTypingText("");
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
      setIsBotTyping(false); // Unlock UI
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
              <div className="three-body" aria-label="Bot is typing">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
              </div>
            ) : (
              msg.text.split("\n").map((line, i) => <p key={i}>{line}</p>)
            )}
          </div>
        ))}

        {/* Typing animation bubble */}
        {typingText && (
          <div className="chat-bubble bot" aria-label="Bot is typing">
            {typingText.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-bar">
        <input
          type="text"
          placeholder="Type your farming question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading || isBotTyping}
          aria-label="Chat input"
        />
        <label className="icon attach" aria-label="Attach file">
          <AttachFile />
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => console.log("File selected:", e.target.files[0])}
            disabled={isLoading || isBotTyping}
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
