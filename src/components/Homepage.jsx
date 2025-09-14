import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  Divider,
  useMediaQuery,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";

export default function Homepage() {
  // State
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Chat input state
  const [inputText, setInputText] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Find active chat
  const activeChat = chats.find((c) => c.id === activeChatId);

  // New chat
  const newChat = () => {
    const id = Date.now();
    const chat = { id, title: `Chat ${chats.length + 1}`, messages: [] };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(id);
    setMobileOpen(false);
    setInputText("");
    setAttachedFile(null);
    setPreviewUrl(null);
  };

  // Delete chat
  const delChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      const next = chats.find((c) => c.id !== id);
      setActiveChatId(next?.id || null);
    }
  };
  const allowedFileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "application/pdf",
    "text/plain",
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!allowedFileTypes.includes(file.type)) {
      toast.error(
        "Invalid file format. Please select an image, PDF, or TXT file."
      );
      e.target.value = null; // reset file input so user can reselect
      return;
    }

    setAttachedFile(file);

    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle cleanup for preview URL to avoid memory leaks
  useEffect(() => {
    if (attachedFile && attachedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(attachedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [attachedFile]);

  // Send message
  const handleSend = () => {
    if (!activeChat) return;
    if (!inputText.trim() && !attachedFile) return;

    // User message
    const userMessage = {
      from: "user",
      text: inputText.trim(),
      file: attachedFile
        ? { name: attachedFile.name, type: attachedFile.type, previewUrl }
        : null,
    };

    // Dummy bot reply
    const botMessage = {
      from: "bot",
      text: "This is a dummy response.",
      file: null,
    };

    const updatedChats = chats.map((chat) =>
      chat.id === activeChat.id
        ? { ...chat, messages: [...chat.messages, userMessage, botMessage] }
        : chat
    );

    setChats(updatedChats);
    setInputText("");
    setAttachedFile(null);
    setPreviewUrl(null);
  };

  // Sidebar content (unchanged)
  const sidebarContent = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h6">Chats</Typography>
      </Box>
      <Divider />
      <List>
        {chats.length === 0 && (
          <Typography sx={{ p: 2 }} color="text.secondary" align="center">
            No chats yet. Click + to start.
          </Typography>
        )}
        {chats.map((chat) => (
          <ListItemButton
            key={chat.id}
            selected={chat.id === activeChatId}
            onClick={() => {
              setActiveChatId(chat.id);
              setMobileOpen(false);
            }}
            sx={{ px: 2 }}
          >
            <ChatBubbleOutline sx={{ mr: 1 }} />
            <ListItemText
              primary={chat.title}
              secondary={
                chat.messages.length
                  ? `${chat.messages.length} messages`
                  : "empty"
              }
            />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                delChat(chat.id);
              }}
              size="small"
              edge="end"
              aria-label="delete chat"
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* App Bar */}
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setMobileOpen(true)}
                sx={{ mr: 1 }}
                size="large"
                aria-label="open drawer"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
          <IconButton
            onClick={newChat}
            color="inherit"
            size="large"
            aria-label="start new chat"
            edge="end"
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Sidebar */}
        {isMobile ? (
          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }} // better open performance on mobile
          >
            {sidebarContent}
          </Drawer>
        ) : (
          <Box
            sx={{
              width: 280,
              borderRight: "1px solid #ddd",
              height: "100%",
              overflowY: "auto",
            }}
          >
            {sidebarContent}
          </Box>
        )}

        {/* Chat Window */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            position: "relative",
          }}
        >
          {/* Messages area */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              backgroundColor: "#f7f7f7",
              mb: "72px", // reserve space for fixed input bar height + margin
            }}
          >
            {activeChat ? (
              <>
                <Typography variant="h6" mb={2}>
                  {activeChat.title}
                </Typography>

                {activeChat.messages.length === 0 && (
                  <Typography color="text.secondary">
                    No messages yet. Say hi!
                  </Typography>
                )}

                {activeChat.messages.map((m, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent:
                        m.from === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        m: 1,
                        maxWidth: "80%",
                        bgcolor: m.from === "user" ? "#d1eaff" : "#f1f1f1",
                        wordBreak: "break-word",
                      }}
                    >
                      <Typography>{m.text}</Typography>
                      {m.file &&
                        m.file.type.startsWith("image/") &&
                        m.file.previewUrl && (
                          <Box
                            component="img"
                            src={m.file.previewUrl}
                            alt={m.file.name}
                            sx={{
                              mt: 1,
                              maxWidth: "100%",
                              borderRadius: 1,
                              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                            }}
                          />
                        )}
                      {m.file && !m.file.type.startsWith("image/") && (
                        <Typography
                          variant="caption"
                          sx={{ display: "block", mt: 1, color: "gray" }}
                        >
                          📎 {m.file.name}
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                ))}
              </>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Start a new chat to begin.
                </Typography>
              </Box>
            )}
          </Box>

          {/* Fixed Chat Input Bar */}
          {/* Fixed Chat Input + Preview Container */}
          {activeChat && (
            <Box
              sx={{
                position: "fixed",
                bottom: 50,
                left: isMobile ? 0 : 280, // leave sidebar width on desktop
                right: 0,
                bgcolor: "background.paper",
                borderTop: "1px solid #ddd",
                boxShadow: "0 -1px 4px rgb(0 0 0 / 0.1)",
                zIndex: (theme) => theme.zIndex.appBar - 1,
                display: "flex",
                flexDirection: "column",
                maxHeight: "200px", // optional max height for preview + input
                overflow: "hidden",
              }}
            >
              {/* Preview box fixed above input */}
              {attachedFile && (
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderBottom: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    overflowX: "auto",
                    bgcolor: "#f0f0f0",
                  }}
                >
                  {attachedFile.type.startsWith("image/") && previewUrl ? (
                    <Box
                      component="img"
                      src={previewUrl}
                      alt={attachedFile.name}
                      sx={{
                        height: 60,
                        objectFit: "contain",
                        borderRadius: 1,
                        mr: 2,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                  ) : (
                    <AttachFileIcon sx={{ mr: 2 }} />
                  )}
                  <Typography noWrap sx={{ flexGrow: 1 }}>
                    {attachedFile.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setAttachedFile(null);
                      setPreviewUrl(null);
                    }}
                    aria-label="remove attachment"
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Box>
              )}

              {/* Input + Send Button */}
              <Paper
                elevation={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                  borderRadius: 0,
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  multiline
                  maxRows={4}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <input
                          type="file"
                          hidden
                          id="file-input"
                          onChange={(e) => {
                            if (e.target.files.length > 0) {
                              const file = e.target.files[0];

                              if (!allowedFileTypes.includes(file.type)) {
                                toast.error(
                                  "Invalid file format. Please select an image, PDF, or TXT file."
                                );
                                e.target.value = null; // reset input so user can try again
                                return;
                              }

                              setAttachedFile(file);

                              if (file.type.startsWith("image/")) {
                                setPreviewUrl(URL.createObjectURL(file));
                              } else {
                                setPreviewUrl(null);
                              }
                            }
                          }}
                        />
                        <label htmlFor="file-input">
                          <Tooltip title="Attach file">
                            <IconButton
                              component="span"
                              size="large"
                              aria-label="attach file"
                            >
                              <AttachFileIcon />
                            </IconButton>
                          </Tooltip>
                        </label>
                      </InputAdornment>
                    ),
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  size="large"
                  disabled={!inputText.trim() && !attachedFile}
                  aria-label="send message"
                >
                  <SendIcon />
                </IconButton>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
