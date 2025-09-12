import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

/* Sidebar supports: permanent on desktop; Drawer on mobile.
   When narrow, it shows icon-only collapsed view (left-floating Drawer).
*/

export default function Sidebar({
  chats,
  setChats,
  activeChatId,
  setActiveChatId,
  mobileOpen,
  setMobileOpen,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const newChat = () => {
    const id = Date.now();
    const chat = { id, title: "New Farmer Chat", messages: [] };
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(id);
    if (isMobile) setMobileOpen(false);
  };

  const delChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) setActiveChatId(chats[0]?.id || null);
  };

  const content = (
    <Box className="sidebar-content" role="presentation">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
        }}
      >
        <Typography variant="h6">Chats</Typography>
        <IconButton onClick={newChat} color="primary" size="small">
          <AddIcon />
        </IconButton>
      </Box>
      <Divider />
      <List className="chat-list">
        {chats.map((c) => (
          <ListItemButton
            key={c.id}
            selected={c.id === activeChatId}
            onClick={() => {
              setActiveChatId(c.id);
              if (isMobile) setMobileOpen(false);
            }}
          >
            <ChatBubbleOutline sx={{ mr: 1 }} />
            <ListItemText
              primary={c.title}
              secondary={
                c.messages?.length ? `${c.messages.length} messages` : "empty"
              }
            />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                delChat(c.id);
              }}
              size="small"
              edge="end"
              color="red"
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ px: 2, mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Tips: Upload leaf photo, ask about fertilizer rates or irrigation.
        </Typography>
      </Box>
    </Box>
  );

  // Permanent drawer on desktop; temporary on mobile
  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ className: "sidebar-drawer-paper" }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Box
      component="nav"
      className="sidebar-permanent"
      aria-label="chat folders"
    >
      {content}
    </Box>
  );
}
