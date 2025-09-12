import React from "react";
import { Paper, Typography } from "@mui/material";

export default function Message({ m }) {
  const cls = m.from === "user" ? "msg user-msg" : "msg assistant-msg";
  return (
    <div className={cls}>
      <Paper elevation={0} className="msg-bubble">
        {m.text && <Typography variant="body1">{m.text}</Typography>}
        {m.image && (
          <img src={m.image} alt="attachment" className="msg-image" />
        )}
        <div className="msg-time">
          {new Date(m.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </Paper>
    </div>
  );
}
