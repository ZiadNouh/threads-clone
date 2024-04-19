import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    // Extracting JWT token from the request cookies
    const token = req.cookies.jwt;

    // If no token is present, return unauthorized error
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Verifying the JWT token to ensure its validity and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Finding the user associated with the extracted user ID from the token
    const user = await User.findById(decoded.userId).select("-password");

    // If no user is found, return unauthorized error
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // If user is found, set the user object in the request for further middleware usage
    req.user = user;

    // Call the next middleware in the chain
    next();
  } catch (err) {
    // Handling any errors that occur during the authorization process
    res.status(500).json({ message: err.message });
    console.log("Error in protectRoute: ", err.message);
  }
};

export default protectRoute;
