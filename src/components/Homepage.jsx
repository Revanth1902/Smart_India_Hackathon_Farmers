import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, AttachFile, Menu } from "@mui/icons-material";
import "../styles/ChatPage.css";

const STORAGE_KEY = "chat_messages";
const PREV_CHATS_KEY = "previous_chats";
const EXPIRY_DAYS = 30;

const ChatPage = () => {
  const messagesEndRef = useRef(null);
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Load current chat messages from localStorage with expiry check
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

  // Load previous chats list
  const loadPreviousChats = () => {
    try {
      const stored = localStorage.getItem(PREV_CHATS_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  };

  const [messages, setMessages] = useState(() => {
    const loaded = loadStoredMessages();
    return loaded && loaded.length ? loaded : [];
  });

  const [previousChats, setPreviousChats] = useState(() => loadPreviousChats());

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  // Save current chat messages to localStorage on every change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ messages, timestamp: new Date().getTime() })
    );
  }, [messages]);

  // Save previous chats list to localStorage
  useEffect(() => {
    localStorage.setItem(PREV_CHATS_KEY, JSON.stringify(previousChats));
  }, [previousChats]);

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
      setIsBotTyping(true);

      await animateTyping(botReply);

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
      setIsBotTyping(false);
    }
  };

  // NEW: Save current chat and start fresh
  const handleNewChat = () => {
    if (messages.length === 0) return; // nothing to save

    const timestamp = new Date().toISOString();
    const title = `Chat on ${new Date().toLocaleString()}`;

    const chatToSave = {
      id: timestamp,
      title,
      timestamp,
      messages,
    };

    setPreviousChats((prev) => [chatToSave, ...prev]);
    setMessages([]);
    setInput("");
    setTypingText("");
    setIsBotTyping(false);
    setIsLoading(false);
    setSidebarOpen(false);
  };

  // Clear current chat without saving
  const handleClearChat = () => {
    setMessages([]);
    setInput("");
    setTypingText("");
    setIsBotTyping(false);
    setIsLoading(false);
  };

  // Load chat from previousChats by id
  const loadChatById = (id) => {
    const chat = previousChats.find((c) => c.id === id);
    if (chat) {
      setMessages(chat.messages);
      setInput("");
      setTypingText("");
      setIsBotTyping(false);
      setIsLoading(false);
      setSidebarOpen(false);
    }
  };

  return (
    <div className="chat-wrapper">
      {/* Sidebar for previous chats */}
      <div
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        aria-hidden={!sidebarOpen}
      >
        <div className="sidebar-header">
          <h2>Previous Chats</h2>
          <button
            className="close-sidebar-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
        {previousChats.length === 0 ? (
          <p className="no-chats">No previous chats saved.</p>
        ) : (
          <ul className="chat-list">
            {previousChats.map((chat) => (
              <li
                key={chat.id}
                className="chat-list-item"
                onClick={() => loadChatById(chat.id)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") loadChatById(chat.id);
                }}
              >
                {chat.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Chat Area */}
      <div className="chat-main">
        <header className="chat-header">
          <button
            className="hamburger-btn icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open previous chats sidebar"
          >
            <Menu />
          </button>

          <div className="header-actions">
            <button
              onClick={handleNewChat}
              className="action-btn"
              aria-label="Start a new chat"
            >
              New Chat
            </button>
            <button
              onClick={handleClearChat}
              className="action-btn"
              aria-label="Clear chat"
            >
              Clear Chat
            </button>
          </div>
        </header>

        <div className="chat-box" role="log" aria-live="polite">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                msg.sender === "user" ? "user" : "bot"
              }`}
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
            disabled={isLoading || isBotTyping}
            aria-label="Send message"
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
