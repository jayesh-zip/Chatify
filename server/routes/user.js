import express from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
  updateUser
} from "../controllers/user.js";
import {
  sendOtp, 
  verifyOtp
} from "../controllers/otp.js"
import { Authenticated, isAuthenticated } from "../middlewares/auth.js";

import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
} from "../lib/validators.js";
import { singleAvatar } from "../middlewares/multer.js";

const app = express.Router();

// Public routes
app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, login);

// Search route needs authentication
app.get("/search", Authenticated, searchUser);

// OTP route (public)
app.post("/send-otp", sendOtp); // New route for sending OTP
app.post("/verify-otp", verifyOtp); // Route to verify OTP

// Use `isAuthenticated` middleware to protect these routes
app.use(isAuthenticated);

// Authenticated routes
app.get("/me", getMyProfile);
app.get("/logout", logout);
app.put("/sendrequest", sendRequestValidator(), validateHandler, sendFriendRequest);
app.put("/acceptrequest", acceptRequestValidator(), validateHandler, acceptFriendRequest);
app.get("/notifications", getMyNotifications);
app.get("/friends", getMyFriends);
app.put("/update", singleAvatar, updateUser);

export default app;
