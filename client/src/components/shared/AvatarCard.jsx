import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import { transformImage } from "../../lib/features";

const AvatarCard = ({ avatar = [], max = 4, size = 35 }) => {
  return (
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup
        max={max}
        sx={{
          position: "relative",
        }}
      >
        <Box width={`${size * 2}px`} height={`${size}px`}>
          {avatar.map((i, index) => (
            <Avatar
              key={Math.random() * 100}
              src={transformImage(i)}
              alt={`Avatar ${index}`}
              sx={{
                width: `${size}px`,  // ✅ Use dynamic size
                height: `${size}px`, // ✅ Use dynamic size
                position: "absolute",
                left: {
                  xs: `${0.5 * index}rem`,
                  sm: `${index * 0.8}rem`,
                },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};
export default AvatarCard;

