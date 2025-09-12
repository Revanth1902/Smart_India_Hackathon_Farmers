import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import "../styles/home.css";
import { Box } from "@mui/material";

export default function Homepage() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  return (
    <Box className="app">
      <Navbar onOpenSidebar={() => setMobileOpen(true)} />
      <Box className="main">
        <Sidebar
          chats={chats}
          setChats={setChats}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <ChatWindow activeChat={activeChat} setChats={setChats} chats={chats} />
      </Box>
    </Box>
  );
}
