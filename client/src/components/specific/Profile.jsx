// import React from "react";
// import { Avatar, Stack, Typography, Box, Paper } from "@mui/material";
// import {
//   Face as FaceIcon,
//   AlternateEmail as UserNameIcon,
//   CalendarMonth as CalendarIcon,
// } from "@mui/icons-material";
// import moment from "moment";
// import { transformImage } from "../../lib/features";

// const Profile = ({ user }) => {
//   return (
//     <Stack
//       spacing={3}
//       direction="column"
//       alignItems="center"
//       sx={{
//         background: "rgba(255, 255, 255, 0.1)",
//         borderRadius: "12px",
//         padding: "2rem",
//         width: "100%",
//         boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
//       }}
//     >
//       {/* Avatar with shadow */}
//       <Avatar
//         src={transformImage(user?.avatar?.url)}
//         sx={{
//           width: 150,
//           height: 150,
//           border: "5px solid white",
//           boxShadow: "0px 4px 12px rgba(255, 255, 255, 0.3)",
//         }}
//       />

//       {/* Profile Details */}
//       <Stack spacing={2} width="100%">
//         <ProfileCard heading="Bio" text={user?.bio} />
//         <ProfileCard heading="Username" text={user?.username} Icon={<UserNameIcon />} />
//         <ProfileCard heading="Name" text={user?.name} Icon={<FaceIcon />} />
//         <ProfileCard heading="Joined" text={moment(user?.createdAt).fromNow()} Icon={<CalendarIcon />} />
//       </Stack>
//     </Stack>
//   );
// };

// const ProfileCard = ({ text, Icon, heading }) => (
//   <Paper
//     elevation={3}
//     sx={{
//       display: "flex",
//       alignItems: "center",
//       gap: "1rem",
//       padding: "12px 16px",
//       borderRadius: "10px",
//       background: "rgba(255, 255, 255, 0.1)",
//       backdropFilter: "blur(10px)",
//       width: "100%",
//     }}
//   >
//     {Icon && <Box sx={{ color: "white", fontSize: "1.5rem" }}>{Icon}</Box>}

//     <Stack>
//       <Typography variant="body1" sx={{ color: "white", fontWeight: 500 }}>
//         {text}
//       </Typography>
//       <Typography color="gray" variant="caption">
//         {heading}
//       </Typography>
//     </Stack>
//   </Paper>
// );

// export default Profile;
