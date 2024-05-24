import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AsyncHandler from "express-async-handler";
const protect = AsyncHandler(async (re, res, next) => {
  let token;
  if (
    re.headers.authorization &&
    re.headers.authorization.startsWith("Bearer")
  ) {
    console.log("token found");
    try {
      const tokenNext = "1234";
      token = re.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, tokenNext);
      re.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      console.log(err);
      res.status(401);
      throw new Error("Not authorisation, token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = (re, res, next) => {
  if (re.user && re.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as admin");
  }
};
export { protect, admin };
