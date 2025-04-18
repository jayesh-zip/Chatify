import { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography, Badge } from "@mui/material";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
  onClick,
}) => {
  return (
    <Link
      sx={{
        textDecoration: "none",
        borderRadius: "8px",
        padding: "5px",
        display: "block",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.11)",
      }}
      to={`/chat/${_id}`}
      onClick={onClick}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, y: "-10%" }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{
          backgroundColor: sameSender ? "#3FBAC2" : "#E5E7EB", // different hover color if selected
          scale: 1.05,
          color: sameSender ? "white" : "black",
          transition: {
            backgroundColor: { duration: 0 },
            scale: { duration: 0.1, ease: "easeInOut" },
          },
        }}
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          backgroundColor: sameSender ? "#2F8F9D" : "#fff",
          color: sameSender ? "white" : "black",
          padding: "10px 12px",
          width: "100%",
          borderRadius: "8px",
          position: "relative",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
        }}
      >
        {/* ✅ Ensuring avatar stays aligned */}
        <Box sx={{ display: "flex", alignItems: "center", minWidth: "40px" }}>
          <AvatarCard avatar={avatar} size={40} />
        </Box>

        {/* ✅ Ensuring consistent alignment for group and normal chat names */}
        <Stack
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          <Typography
            fontWeight="700"
            fontSize="0.90rem"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {name}
          </Typography>
          {newMessageAlert && newMessageAlert.count > 0 && (
            <Typography fontSize="0.7rem" color="gray">
              {newMessageAlert.count} New Message
              {newMessageAlert.count > 1 ? "s" : ""}
            </Typography>
          )}
        </Stack>

        {/* ✅ Fixed green dot positioning */}
        {isOnline && !groupChat && (
          <Box
            sx={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              border: "2px solid white",
            }}
          />
        )}

        {newMessageAlert && newMessageAlert.count > 0 && (
          <Badge
            badgeContent={newMessageAlert.count}
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              "& .MuiBadge-badge": {
                backgroundColor: "#1daa61", // Correct way to apply custom color
                color: "white", // Ensure text is visible
              },
            }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
