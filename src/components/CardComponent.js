import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function CardComponent({ title, icon: Icon, color, to }) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: color,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: 2,
        boxShadow: 3,
      }}
      onClick={() => navigate(to)}
      elevation={4}
    >
      <CardActionArea
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Box sx={{ mb: 2, color: "primary.main" }}>
          <Icon sx={{ fontSize: 60 }} />
        </Box>
        <Typography
          variant="h6"
          component="h2"
          align="center"
          sx={{
            fontWeight: "bold",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

export default CardComponent;
