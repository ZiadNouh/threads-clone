import mongoose from "mongoose";

// Define the schema for the "Post" document
const postSchema = mongoose.Schema(
  {
    // Reference to the user who posted the item
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Text content of the post
    text: {
      type: String,
      maxLength: 500,
      required: true,
    },
    // Image associated with the post
    img: {
      type: String,
    },
    // Users who have liked the post
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    // Replies to the post
    replies: [
      {
        // User who made the reply
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        // Text content of the reply
        text: {
          type: String,
          maxLength: 500,
          required: true,
        },
        // Profile picture of the user who made the reply
        userProfilePic: {
          type: String,
        },
        // Username of the user who made the reply
        username: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true } // Automatically adds "createdAt" and "updatedAt" fields
);

// Create the "Post" model using the schema
const Post = mongoose.model("Post", postSchema);

export default Post;
