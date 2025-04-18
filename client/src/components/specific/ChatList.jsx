import {
  Stack,
  Box,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import {
  Group,
  Search as SearchIcon,
  SmartToy as AiIcon,
} from "@mui/icons-material"; // AI Icon
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatItem from "../shared/ChatItem";
import { width } from "@mui/system";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [],
  handleDeleteChat,
  onChatSelect, // ✅ Accept onChatSelect prop
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilteredChats(
        chats.filter((chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, chats]);

  return (
    <Stack
      width={w}
      direction="column"
      sx={{
        background: "#f8f9fa",
        borderRadius: "12px",
        padding: "10px",
        height: "100%",
        overflowY: "auto",
        flexGrow: 1,
        minHeight: 0,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ marginBottom: "14px" }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            background: "#d1e7ff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Group sx={{ color: "#1565c0", fontSize: "1.8rem" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#222",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "1.2rem",
          }}
        >
          Contacts
        </Typography>
      </Stack>

      {/* Search Box */}
      <TextField
        placeholder="Search chats..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          marginBottom: "12px",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.12)",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "& fieldset": { border: "none" },
            "&:hover fieldset": { borderColor: "#1976d2" },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#555" }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Chat List */}
      {filteredChats.length > 0 ? (
        filteredChats.map((data, index) => {
          const { avatar, _id, name, groupChat, members } = data;
          const newMessageAlert = newMessagesAlert.find(
            ({ chatId }) => chatId === _id
          );
          const isOnline = members?.some((member) =>
            onlineUsers.includes(member)
          );

          return (
            <ChatItem
              index={index}
              newMessageAlert={newMessageAlert}
              isOnline={isOnline}
              avatar={avatar}
              name={name}
              _id={_id}
              key={_id}
              groupChat={groupChat}
              sameSender={chatId === _id}
              handleDeleteChat={handleDeleteChat}
              onClick={() => {
                navigate(`/chat/${_id}`);
                if (onChatSelect) onChatSelect(); // ✅ Close drawer when clicked
              }}
            />
          );
        })
      ) : (
        <Typography
          textAlign="center"
          color="textSecondary"
          variant="body2"
          mt={2}
          sx={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem" }}
        >
          No chats found
        </Typography>
      )}
    </Stack>
  );
};

export default ChatList;
