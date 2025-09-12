import React, { useState, useRef, useEffect } from "react";
import { Box, Paper, IconButton, InputBase, Tooltip } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Message from "./Message";
import RecommendationCard from "./RecommendationCard";

/* ChatWindow handles messages, image upload preview, and voice trigger button.
   It auto-simulates a basic assistant reply for demonstration.
*/

export default function ChatWindow({ activeChat, chats, setChats }) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef();
  const messagesEndRef = useRef();

  useEffect(() => {
    // scroll to bottom when activeChat changes/messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat, chats]);

  if (!activeChat) {
    return (
      <Box className="chat-empty">Select or start a new chat to begin.</Box>
    );
  }

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSend = () => {
    if (!text.trim() && !imagePreview) return;
    const newMsg = {
      id: Date.now(),
      from: "user",
      text: text.trim(),
      image: imagePreview,
      time: Date.now(),
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id ? { ...c, messages: [...c.messages, newMsg] } : c
      )
    );
    setText("");
    setImagePreview(null);

    // simulate assistant reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        from: "assistant",
        text: "Analyzing... Based on the image/text, I suggest...",
        time: Date.now(),
      };
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChat.id
            ? { ...c, messages: [...c.messages, reply] }
            : c
        )
      );
    }, 900);
  };

  return (
    <Box className="chat-window-wrapper">
      <Box className="chat-main">
        <Paper className="chat-messages-paper" elevation={0}>
          {activeChat.messages?.map((m) => (
            <Message key={m.id} m={m} />
          ))}
          <div ref={messagesEndRef} />
        </Paper>
      </Box>

      {/* <Box className="recommendation-column">
        <RecommendationCard />
      </Box> */}

      <Box className="chat-composer">
        {imagePreview && (
          <Box className="img-preview">
            <img src={imagePreview} alt="preview" />
            <button
              className="img-remove"
              onClick={() => setImagePreview(null)}
            >
              ×
            </button>
          </Box>
        )}

        <Paper
          component="form"
          className="composer-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <InputBase
            className="composer-input"
            placeholder="Ask about crop, upload image, or say 'diagnose'..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            inputProps={{ "aria-label": "message-input" }}
          />

          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileRef}
            onChange={handleFile}
          />
          <Tooltip title="Attach image">
            <IconButton
              onClick={() => fileRef.current?.click()}
              aria-label="attach"
            >
              <PhotoCamera />
            </IconButton>
          </Tooltip>
          <Tooltip title="Attach file">
            <IconButton aria-label="attach-file">
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
          <IconButton type="submit" color="primary" aria-label="send">
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
}
