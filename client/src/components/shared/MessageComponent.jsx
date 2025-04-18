import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import { lightBlue } from "../../constants/color";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user, isGroupChat }) => {
  const { sender, content, attachments = [], createdAt } = message;

  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, x: sameSender ? "100%" : "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: sameSender ? "#3A9D9D" : "#FDF6E3", // ✅ Matches your chat background
        color: sameSender ? "white" : "black",
        borderRadius: sameSender ? "12px 12px 0 12px" : "12px 12px 12px 0",
        padding: "0.75rem 1rem",
        maxWidth: "80%", // ✅ Limits message width to 80% of the chat container
        wordWrap: "break-word",
        overflowWrap: "break-word",
        whiteSpace: "pre-wrap",
        boxShadow: "1px 1px 0px rgba(0, 0, 0, 0.6)",
        marginBottom: "8px",
      }}
    >
      {/* ✅ Show sender's name ONLY in group chat and ONLY for other users */}
      {isGroupChat && !sameSender && (
        <Typography color={lightBlue} fontWeight={"600"} variant="caption">
          {sender.name}
        </Typography>
      )}

      {content && (
        <Typography sx={{ wordBreak: "break-word" }}>{content}</Typography>
      )}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box key={index} mt={0.5}>
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: sameSender ? "white" : "black",
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}

      <Typography
        variant="caption"
        color={sameSender ? "white" : "gray"}
        sx={{ display: "block", textAlign: "right", marginTop: "4px" }}
      >
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
