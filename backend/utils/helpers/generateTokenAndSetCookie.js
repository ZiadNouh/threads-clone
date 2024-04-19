import jwt from "jsonwebtoken";

// Function to generate JWT token and set it as a cookie in the response
const generateTokenAndSetCookie = (userId, res) => {
  // Generate JWT token with userId payload and sign it using JWT_SECRET from environment variables
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d", // Token expiration set to 15 days
  });

  // Set JWT token as a cookie in the response
  res.cookie("jwt", token, {
    httpOnly: true, // Cookie is accessible only through HTTP(S) requests
    maxAge: 15 * 24 * 60 * 60 * 1000, // Max age of cookie set to 15 days
    sameSite: "strict", // Cookie is sent only for same-site requests
  });

  // Return the generated token
  return token;
};

export default generateTokenAndSetCookie;
