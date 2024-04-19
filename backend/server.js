import express from "express";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

const app = express();

app.use(cookieParser());
// app.use(cors(corsOptions));
app.use(
  cors({
    origin: "http://localhost:3000/",
    credentials: true,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to parse incoming JSON data with a limit of 50MB
app.use(express.json({ limit: "50mb" }));

// Middleware to parse incoming URL-encoded data with a limit of 50MB and extended set to true allows for complex objects and arrays to be encoded
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

//httt://localhost:5000 => backend,frontend

// Check if the app is running in production mode
if (process.env.NODE_ENV === "production") {
  // Serve static files (HTML, CSS, JS, etc.) from the frontend's 'dist' directory
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // Catch-all route for GET requests
  // This route is triggered when no other route matches the request
  app.get("*", (req, res) => {
    // Send the 'index.html' file from the frontend's 'dist' directory as the response
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
