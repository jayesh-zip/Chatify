import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

const ProfileDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Profile</DialogTitle>
      <DialogContent>
        {/* Profile details go here */}
        <p>User Profile Content...</p>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
