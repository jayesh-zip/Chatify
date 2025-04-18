import { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import {
  Button, TextField, Typography, Avatar, Box, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";

export default function UpdateUser({ onClose }) {
  const { user, fetchUser, updateUser, loading, error } = useUser();
  const [inputs, setInputs] = useState({ name: "", username: "", bio: "", password: "" });
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!user) fetchUser(); // ✅ Fetch user data only if it's null
  }, [user, fetchUser]);

  useEffect(() => {
    if (user) {
      setInputs({
        name: user.name || "",
        username: user.username || "N/A", // ✅ Ensure username is shown
        bio: user.bio || "",
        password: "",
      });
      setAvatar(user.avatar?.url || ""); // ✅ Show existing avatar
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", inputs.name);
    formData.append("bio", inputs.bio);
    formData.append("password", inputs.password);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
  
    await updateUser(formData);
  
    if (!error) {
      await fetchUser(); // ✅ Explicitly fetch user data after update
      onClose();
    }
  };
  

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Profile</DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 2 }}>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={avatar} sx={{ width: 60, height: 60 }} />
              <Button variant="contained" onClick={() => fileRef.current.click()}>
                Change Avatar
              </Button>
              <input type="file" hidden ref={fileRef} onChange={handleImageChange} />
            </Box>

            {/* ✅ Immutable Username Field */}
            <TextField
              label="Username"
              fullWidth
              variant="outlined"
              value={inputs.username}
              disabled // ✅ Read-only field
            />

            <TextField
              label="Full Name"
              fullWidth
              variant="outlined"
              value={inputs.name}
              inputProps={{ maxLength: 17 }}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            />

            <TextField
              label="Bio"
              fullWidth
              variant="outlined"
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            />

            <TextField
              label="New Password"
              fullWidth
              variant="outlined"
              type="password"
              value={inputs.password}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            />

            {error && <Typography color="error">{error.message || error}</Typography>}
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}