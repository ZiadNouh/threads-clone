import mongoose from "mongoose";

// Define the schema for the "User" document
const userSchema = mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
    },
    // User's unique username
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // User's unique email address
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // User's password (min length of 6 characters)
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    // URL of the user's profile picture
    profilePic: {
      type: String,
      default: "",
    },
    // Array of user IDs who follow this user
    followers: {
      type: [String],
      default: [],
    },
    // Array of user IDs whom this user follows
    following: {
      type: [String],
      default: [],
    },
    // User's biography
    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically adds "createdAt" and "updatedAt" fields
  }
);

// Create the "User" model using the schema
const User = mongoose.model("User", userSchema);

export default User;
