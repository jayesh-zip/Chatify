import { compare } from "bcrypt";
import cloudinary from "cloudinary";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { User } from "../models/user.js";
import {
  cookieOptions,
  emitEvent,
  sendToken,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

// Create a new user and save it to the database and save token in cookie
const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;

  const file = req.file;

  if (!file) return next(new ErrorHandler("Please Upload Avatar"));

  const result = await uploadFilesToCloudinary([file]);

  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };

  const user = await User.create({
    name,
    bio,
    username,
    password,
    avatar,
  });

  sendToken(res, user, 201, "User created");
});

// Login user and save token in cookie
const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

  const isMatch = await compare(password, user.password);

  if (!isMatch)
    return next(new ErrorHandler("Invalid Username or Password", 404));

  sendToken(res, user, 200, `Welcome Back, ${user.name}`);
});

const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("chattu-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});


const updateUser = async (req, res) => {
  try {
    const { name, bio, password } = req.body; // ✅ Only name, bio, password allowed
    const file = req.file;

    // Find the user
    let user = await User.findById(req.user).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    // Ensure at least one field is being updated
    if (!name && !bio && !password && !file)
      return res.status(400).json({ error: "At least one field must be updated" });

    // Assign the new password (hashing will be handled by pre-save middleware)
    if (password) user.password = password;

    // Handle avatar update
    if (file) {
      if (user.avatar.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }
      const result = await uploadFilesToCloudinary([file]);
      user.avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
      };
    }

    // Update other fields if provided
    if (name) user.name = name;
    if (bio) user.bio = bio;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Error in updateUser:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};




// Updated controller with the TryCatch wrapper
const searchUser = TryCatch(async (req, res) => {
  // Validate if user is authenticated
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const { name = "" } = req.query;

  // Finding all my chats (to identify friends or people I have chatted with)
  const myChats = await Chat.find({ groupChat: false, members: req.user });

  // Extracting all users from my chats
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  // Ensure unique user IDs and include the logged-in user for exclusion
  const excludeIds = new Set([...allUsersFromMyChats.map((id) => id.toString()), req.user._id.toString()]);

  // Finding all users except the logged-in user and their friends
  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: Array.from(excludeIds) },
    name: { $regex: name, $options: "i" },
  });

  // Modifying the response
  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));

  return res.status(200).json({
    success: true,
    users,
  });
});



const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) return next(new ErrorHandler("Request already sent", 400));

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  return res.status(200).json({
    success: true,
    message: "Friend Request Sent",
  });
});



const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.receiver._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 401)
    );

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}-${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    senderId: request.sender._id,
  });
});




const getMyNotifications = TryCatch(async (req, res) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});

const getMyFriends = TryCatch(async (req, res) => {
  const chatId = req.query.chatId;

  const chats = await Chat.find({
    members: req.user,
    groupChat: false,
  }).populate("members", "name avatar");

  const friends = chats.map(({ members }) => {
    const otherUser = getOtherMember(members, req.user);

    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });

  if (chatId) {
    const chat = await Chat.findById(chatId);

    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});


export {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  updateUser,
  newUser,
  searchUser,
  sendFriendRequest,
};
