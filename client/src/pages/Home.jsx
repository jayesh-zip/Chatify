import AppLayout from "../components/layout/AppLayout";
import { Box } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import { grayColor } from "../constants/color";

// Define keyframes for smooth zoom effect
const zoomAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

// Styled component for animated image
const AnimatedImage = styled("img")({
  maxWidth: "80%", // Makes image responsive
  maxHeight: "60vh", // Prevents oversized image
  objectFit: "contain", // Maintains aspect ratio
  animation: `${zoomAnimation} 3s infinite ease-in-out`,
});

const Home = () => {
  return (
    <Box
      bgcolor={grayColor}
      minHeight="100%" // Fixes full screen height
      width="100%" // Ensures full width
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      overflow="hidden" // Prevents any scrolling
    >
      <AnimatedImage src="/chat4.png" alt="Chat Icon" />
    </Box>
  );
};

// Ensure no body scroll
// document.body.style.overflow = "hidden";

export default AppLayout()(Home);
