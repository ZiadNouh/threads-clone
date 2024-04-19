import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Post from "../models/postModel.js";

const signupUser = async (req, res, next) => {
  try {
    // Extracting user details from request body
    const { name, email, username, password } = req.body;

    // Checking if user with provided email or username already exists
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      // If user already exists, return error response
      return res.status(400).json({ error: "User already exists" });
    }

    // Generating salt and hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating a new user instance with hashed password
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // Saving the new user to the database
    await newUser.save();

    // If user is successfully created, generate JWT token and set cookie
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      // Sending success response with user details
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      // If user creation fails, return error response
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    // Handling any errors that occur during the signup process
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};

const loginUser = async (req, res, next) => {
  try {
    // Extracting username and password from request body
    const { username, password } = req.body;

    // Finding user by username
    const user = await User.findOne({ username });

    // Checking if user exists and password is valid
    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || "" // Use empty string if user is not found to avoid potential errors
    );

    // If user does not exist or password is invalid, return error response
    if (!user || !isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // If username and password are valid, generate JWT token and set cookie
    generateTokenAndSetCookie(user._id, res);

    // Sending success response with user details
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    // Handling any errors that occur during the login process
    res.status(500).json({ error: error.message });
    console.log("Error in loginUser: ", error.message);
  }
};

const logOut = (req, res, next) => {
  try {
    // Clearing the JWT cookie by setting its value to an empty string and maxAge to 1 millisecond
    res.cookie("jwt", "", { maxAge: 1 });

    // Sending success response indicating the user has logged out successfully
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    // Handling any errors that occur during the logout process
    res.status(500).json({ error: error.message });
    console.log("Error in logOut: ", error.message);
  }
};

const followUnFollowUser = async (req, res, next) => {
  try {
    // Extracting the user ID to follow/unfollow from the request parameters
    const { id } = req.params;

    // Finding the user to be modified (followed/unfollowed) and the current user
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    // Checking if the user is trying to follow/unfollow themselves
    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });

    // Handling cases where either the user to modify or the current user is not found
    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    // Checking if the current user is already following the user to modify
    const isFollowing = currentUser.following.includes(id);

    // If the current user is already following the user to modify, unfollow them
    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // If the current user is not following the user to modify, follow them
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    // Handling any errors that occur during the follow/unfollow process
    res.status(500).json({ error: err.message });
    console.log("Error in followUnFollowUser: ", err.message);
  }
};

const updateUser = async (req, res) => {
  try {
    // Extracting user information from request body
    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body;

    // Getting user ID from request
    const userId = req.user._id;

    // Finding user by ID
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    // Ensuring only the user can update their own profile
    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile" });

    // Hashing password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // Handling profile picture update
    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    // Updating user information with provided or existing values
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    // Saving updated user information
    user = await user.save();

    // Finding all posts where this user replied and updating username and userProfilePic fields
    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    // Setting password to null in response for security reasons
    user.password = null;

    // Sending updated user information in response
    res.status(200).json(user);
  } catch (err) {
    // Logging error and sending error response
    console.log("Error in updateUser:", err);
    res.status(500).json({ error: err.message });
  }
};

const getUserProfile = async (req, res, next) => {
  // Extracting username or userId from request parameters
  const { query } = req.params;

  try {
    let user;

    // Checking if query is a valid userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      // Finding user by userId, excluding password and updatedAt fields
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      // Finding user by username, excluding password and updatedAt fields
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    // Handling user not found
    if (!user) return res.status(404).json({ error: "User not found" });

    // Sending user profile information in response
    res.status(200).json(user);
  } catch (err) {
    // Handling errors and sending error response
    res.status(500).json({ error: err.message });
    console.log("Error in getUserPage: ", err.message);
  }
};

export default {
  signupUser,
  loginUser,
  logOut,
  followUnFollowUser,
  updateUser,
  getUserProfile,
};
