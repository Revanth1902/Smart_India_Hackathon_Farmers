import React from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { SvgIcon } from "@mui/material"; // For custom icons
import { Link } from "react-router-dom";

function CardComponent({ title, icon: Icon, color, to }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: color,
        color: "white", // Text color on the card
        p: 2,
      }}
    >
      <CardActionArea
        component={Link}
        to={to}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SvgIcon sx={{ fontSize: 60, mb: 1 }}>
          <Icon />
        </SvgIcon>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

export default CardComponent;
