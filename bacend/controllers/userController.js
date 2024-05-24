import asyncHandler from "express-async-handler";
import Product from "../models/userModel.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateTokens.js";
const authUser = asyncHandler(async (re, res) => {
  const { email, password } = re.body;
  const user = await User.findOne({ email });
  console.log(user);
  console.log(re.body);
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.idAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or  password");
  }
});

const registerUser = asyncHandler(async (re, res) => {
  const { name, email, password } = re.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(401);
    throw new Error("User already Exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    res.send(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const getUserProfile = asyncHandler(async (re, res) => {
  const user = await User.findById(re.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.idAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (re, res) => {
  const user = await User.findById(re.user._id);

  if (user) {
    user.name = re.body.name || user.name;
    user.email = re.body.email || user.body;
    if (re.body.password) {
      user.password = re.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.idAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

const getUsers = asyncHandler(async (re, res) => {
  const users = await User.find({});
  res.json(users);
});
const deleteUser = asyncHandler(async (re, res) => {
  const user = await User.findById(re.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "user removed" });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

const getUserById = asyncHandler(async (re, res) => {
  const user = await User.findById(re.params.id).select("-password");
  if (user) {
    res.json({ user });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUser = asyncHandler(async (re, res) => {
  const user = await User.findById(re.params.id);

  if (user) {
    user.name = re.body.name || user.name;
    user.email = re.body.email || user.body;
    user.isAdmin = re.body.isAdmin || user.isAdmin;
    const updateuser = await user.save();

    res.json({
      _id: updateuser._id,
      name: updateuser.name,
      email: updateuser.email,
      isAdmin: updateuser.idAdmin,
      token: generateToken(updateuser._id),
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
};
