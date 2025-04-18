import { Grid, Skeleton, Stack } from "@mui/material";
import { BouncingSkeleton } from "../styles/StyledComponents";

const LayoutLoader = () => {
  return (
    <Grid 
      container 
      height="calc(100vh - 4rem)" 
      spacing={2} // More natural spacing
      padding={2} // Adds breathing room
    >
      {/* Sidebar */}
      <Grid
        item
        sm={4}
        md={3}
        sx={{ display: { xs: "none", sm: "block" } }}
        height="100%"
      >
        <Skeleton 
          variant="rectangular" 
          height="100%" 
          sx={{ borderRadius: "12px", boxShadow: 1 }} 
        />
      </Grid>

      {/* Chat Area */}
      <Grid item xs={12} sm={8} md={5} lg={6} height="100%">
        <Stack spacing={2} padding={2}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton 
              key={index} 
              variant="rounded" 
              height="5rem"
              sx={{ borderRadius: "12px", boxShadow: 1 }}
            />
          ))}
        </Stack>
      </Grid>

      {/* Right Sidebar */}
      <Grid
        item
        md={4}
        lg={3}
        height="100%"
        sx={{ display: { xs: "none", md: "block" } }}
      >
        <Skeleton 
          variant="rectangular" 
          height="100%" 
          sx={{ borderRadius: "12px", boxShadow: 1 }} 
        />
      </Grid>
    </Grid>
  );
};

const TypingLoader = () => {
  return (
    <Stack
      spacing={1}
      direction="row"
      padding={1}
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: "#f5f5f5", borderRadius: "12px", padding: "0.75rem" }}
    >
      {[0.1, 0.2, 0.4, 0.6].map((delay, index) => (
        <BouncingSkeleton
          key={index}
          variant="circular"
          width={12}
          height={12}
          sx={{ animationDelay: `${delay}s`, backgroundColor: "#bbb" }}
        />
      ))}
    </Stack>
  );
};

export { TypingLoader, LayoutLoader };
