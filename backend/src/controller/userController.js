import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import crypto from "crypto";

import { sendEmail } from "../utils/sendEmail.js";

import { imagekit, uploadImage } from "../utils/imagekit.js";
import multer from "multer";


// 🧩 Setup multer to handle multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage });


// ✅ Export multer middleware for route use
export const uploadMiddleware = upload.single("avatar");

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔹 Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 🔹 Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 🔹 Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // 🔹 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // 🔹 Check avatar image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Avatar image required",
      });
    }

    // ✅ Upload image to ImageKit
    const uploaded = await uploadImage(req.file);

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: {
        public_id: uploaded.fileId,
        url: uploaded.url,
      },
    });

    // ✅ Hide password before sending response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2️⃣ Check valid email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 3️⃣ Find user and include password (since it’s `select:false` in schema)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4️⃣ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 5️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "yourSecretKey",
      { expiresIn: "5d" }
    );

    const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
  httpOnly: true,
  secure: isProduction,              // only true in production
  sameSite: isProduction ? "none" : "lax",
  expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
});

    // 7️⃣ Remove password before sending response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    // ✅ If a new avatar is uploaded
    if (req.file) {
      // if (user.avatar && user.avatar.public_id) {
      //   await imagekit.deleteFile(user.avatar.public_id);
      // }

      const uploadResponse = await uploadImage(req.file); // this should return { fileId, url }

      newUserData.avatar = {
        public_id: uploadResponse.fileId,
        url: uploadResponse.url,
      };
    }

    // ✅ Update user
    const updateUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      user: updateUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ LOGOUT USER
export const logoutUser = (req, res) => {
  try {
    // Clear the token cookie
   res.cookie("token", "", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  expires: new Date(0),
});

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    // req.user is available if user is authenticated (from auth middleware)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Generate token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;


    const message = `
      <h2>Password Reset Request</h2>
      <p>Hello ${user.name || "User"},</p>
      <p>You recently requested to reset your password. Click the button below to reset it:</p>
      <a href="${resetUrl}" 
         style="display:inline-block;padding:10px 20px;margin-top:10px;background-color:#4F46E5;color:white;text-decoration:none;border-radius:5px;">
         Reset Password
      </a>
      <p>If you didn’t request this, please ignore this email.</p>
      <p>Thanks,<br/>FirstShop</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset - FirstShop",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Password reset link sent to ${user.email}`,
      });
    } catch (error) {
      // Roll back token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending reset password email",
      error: error.message,
    });
  }
};



export const resetPassword = async (req, res) => {
  try {
    // Hash the token again (to match DB)
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find user with token and valid expiry
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset password token is invalid or expired",
      });
    }

    // Validate passwords
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }


    user.password = await bcrypt.hash(password, 10);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};



export const updatePassword = async (req, res) => {
  try {
    // 1️⃣ Get user ID from authenticated token (middleware must set req.user)
    const userId = req.user.id;

    const { oldPassword, newPassword, confirmPassword } = req.body;

    // 2️⃣ Validate input
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields",
      });
    }

    // 3️⃣ Check new password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // 4️⃣ Find the user
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 5️⃣ Verify old password
    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // 6️⃣ Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating password",
      error: error.message,
    });
  }
};


//admin get All user information

export const getUserList = async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users
  })
}

export const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "user id doesn't exist"
    })
  }

  res.status(200).json({
    success: true,
    message: "user fetched succesfully",
    user
  })
}

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const newUserData = { role };

    const user = await User.findByIdAndUpdate(
      req.params.id,
      newUserData,
      {
        new: true,
        runValidators: true
      }
    ).select("name email role"); // return name & email

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User ID doesn't match",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    // 🗑 Delete avatar if exists
    if (user.avatar && user.avatar.public_id) {
      await imagekit.deleteFile(user.avatar.public_id);
    }

    // Delete user from DB
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




