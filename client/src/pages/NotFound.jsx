import React from 'react';
import { Error as ErrorIcon } from "@mui/icons-material";
import { Container, Stack, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Stack alignItems={"center"} spacing={3}>
        <ErrorIcon sx={{ fontSize: "8rem", color: "#ff6b6b" }} />
        <Typography variant="h2" fontWeight="bold" color="primary">
          404 - Page Not Found
        </Typography>
        <Typography variant="h5" color="textSecondary">
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{
            padding: "0.8rem 2rem",
            fontSize: "1rem",
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Go Back to Home
        </Button>
      </Stack>
    </Container>
  );
};

export default NotFound;
