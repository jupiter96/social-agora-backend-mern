import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      (await req.cookies?.token) ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid Access Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in signupUser: ", error.message);
  }
};
