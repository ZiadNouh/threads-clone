import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res, next) => {
  try {
    // Extracting necessary fields from request body
    const { postedBy, text } = req.body;
    let { img } = req.body; // Extracting image field from request body

    // Checking if required fields are present
    if (!postedBy || !text)
      return res
        .status(400)
        .json({ error: "Postedby and text fields are required" });

    // Finding the user who is creating the post
    const user = await User.findById(postedBy);

    // Handling case where user is not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verifying if the user creating the post is the same as the authenticated user
    if (user._id.toString() !== req.user._id.toString()) {
      return res
        .status(402)
        .json({ error: "Can't create post for another user" });
    }

    // Maximum length allowed for post text
    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    // Uploading image to Cloudinary if provided
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    // Creating a new post object
    const newPost = new Post({ postedBy, text, img });
    // Saving the new post to the database
    await newPost.save();

    // Sending a successful response with the newly created post
    res.status(200).json(newPost);
  } catch (error) {
    // Handling errors and sending error response
    res.status(500).json({
      error: error.message,
    });
    console.log(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    // Finding post by ID
    const post = await Post.findById(req.params.id);

    // Handling case where post is not found
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Sending post information in response
    return res.status(200).json(post);
  } catch (error) {
    // Handling errors and sending error response
    res.status(500).json({
      error: error.message,
    });
    console.log(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    // Finding post by ID
    const post = await Post.findById(req.params.id);
    // Handling case where post is not found
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Verifying if the user deleting the post is the same as the one who created it
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete post" });
    }

    // If the post has an image, delete it from Cloudinary
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    // Deleting the post from the database
    await Post.findByIdAndDelete(req.params.id);

    // Sending a success message in response
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    // Handling errors and sending error response
    res.status(500).json({ error: err.message });
  }
};

const likeUnlikePost = async (req, res, next) => {
  try {
    // Extracting post ID from request parameters
    const { id: postId } = req.params;
    // Extracting user ID from authenticated user
    const userId = req.user._id;

    // Finding the post by ID
    const post = await Post.findById(postId);
    // Handling case where post is not found
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Checking if the user has already liked the post
    const userLikedPost = await post.likes.includes(userId);

    // If user has already liked the post, unlike it
    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      return res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // If user has not liked the post, like it
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      return res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    // Handling errors and sending error response
    res.status(500).json({
      error: error.message,
    });
    console.log(error);
  }
};

const replyToPost = async (req, res, next) => {
  try {
    // Extracting text from request body
    const { text } = req.body;
    // Extracting post ID from request parameters
    const { id: postId } = req.params;
    // Extracting user information from authenticated user
    const { _id: userId, profilePic, username } = req.user;

    // Checking if text field is provided
    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    // Finding the post by ID
    const post = await Post.findById(postId);
    // Handling case where post is not found
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Creating a reply object
    const reply = { userId, text, profilePic, username };

    // Adding the reply to the post's replies array
    post.replies.push(reply);
    await post.save();

    // Sending the reply in the response
    res.status(200).json(reply);
  } catch (error) {
    // Handling errors and sending error response
    res.status(500).json({
      error: error.message,
    });
    console.log(error);
  }
};

const getFeedPosts = async (req, res, next) => {
  try {
    // Extracting user ID from authenticated user
    const userId = req.user;
    // Finding the user by ID
    const user = await User.findById(userId);

    // Handling case where user is not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extracting the IDs of users whom the authenticated user follows
    const following = user.following;

    // Finding posts created by users whom the authenticated user follows
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    }); // Sorting posts by creation date in descending order

    // Sending the feed posts in the response
    res.status(200).json(feedPosts);
  } catch (error) {
    // Handling errors and sending error response
    res.status(500).json({
      error: error.message,
    });
    console.log(error);
  }
};

const getUserPosts = async (req, res, next) => {
  const { username } = req.params;
  try {
    // Finding the user by username
    const user = await User.findOne({ username });

    // Handling case where user is not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Finding posts created by the user
    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    }); // Sorting posts by creation date in descending order

    // Sending the user's posts in the response
    res.status(200).json(posts);
  } catch (error) {
    // Handling errors and sending error response
    res.status(500).json({ error: error.message });
  }
};

export default {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
};
