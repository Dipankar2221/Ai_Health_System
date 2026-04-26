import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import crypto from "crypto";
import multer from "multer";
import { sendEmail } from "../utils/sendEmail.js";
import { uploadImage } from "../utils/imagekit.js";

// ================= MULTER =================
const storage = multer.memoryStorage();
const upload = multer({ storage });
export const uploadMiddleware = upload.single("avatar");

// ================= COOKIE CONFIG =================
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
};

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    if (!req.file)
      return res.status(400).json({ message: "Avatar required" });

    const uploaded = await uploadImage(req.file);
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      avatar: {
        public_id: uploaded.fileId,
        url: uploaded.url,
      },
    });

    user.password = undefined;

    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    res.cookie("token", token, cookieOptions);

    user.password = undefined;

    res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET USER (/me) =================
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGOUT =================
export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    ...cookieOptions,
    expires: new Date(0),
  });

  res.json({ success: true, message: "Logged out" });
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
    };

    if (req.file) {
      const uploaded = await uploadImage(req.file);
      data.avatar = {
        public_id: uploaded.fileId,
        url: uploaded.url,
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, data, {
      new: true,
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const token = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const url = `${process.env.FRONTEND_URL}/password/reset/${token}`;

    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      message: `Reset here: ${url}`,
    });

    res.json({ success: true, message: "Email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid token" });

    if (req.body.password !== req.body.confirmPassword)
      return res.status(400).json({ message: "Password mismatch" });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset done" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE PASSWORD =================
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const match = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!match)
      return res.status(400).json({ message: "Old password wrong" });

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ADMIN =================
export const getUserList = async (req, res) => {
  const users = await User.find();
  res.json({ success: true, users });
};

export const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(404).json({ message: "User not found" });

  res.json({ success: true, user });
};

export const updateUserRole = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true }
  );

  res.json({ success: true, user });
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: "User deleted" });
};