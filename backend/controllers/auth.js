import bcrypt from "bcryptjs";
import User from "../models/userModel.js";  // adjust path
import genToken from "../utils/token.js"; // adjust path
import { sendMailOtp } from "../utils/mails.js";

// ================== SIGNUP ==================
const signup = async (req, res) => {
  try {
    const { username, email, password, mobile, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    await newUser.save();

    // Generate token after saving
    const token = genToken(newUser._id);

    // Send token in cookie
    res.cookie("token", token, { httpOnly: true, path: "/", });

    return res.status(201).json({ message: "Registered successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================== SIGNIN ==================
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password does not match" });
    }

    // Generate token
    const token = genToken(existingUser._id);

    // Send token in cookie
    res.cookie("token", token, { httpOnly: true, path: "/", });

    return res.status(200).json({
      token,
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        mobile: existingUser.mobile,
        role: existingUser.role,
      },
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================== LOGOUT ==================
const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      path: "/",
    });
    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ================== SEND OTP ON EMAIL ==================

 const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" }); // <-- return here
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.isOtpVerified = false;

    await user.save();

    await sendMailOtp(email, otp); // sendMailOtp is used for send otp on email

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ message: "Send otp error", error: error.message });
  }
};


// ================== VERIFY OTP ==================

 const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email })

    if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid otp" })
    }
    user.isOtpVerified = true
    user.otpExpires = undefined
    user.resetOtp = undefined
    await user.save();
    return res.status(200).json({ message: "Otp verify successfully" })
  } catch (error) { return res.status(400).json({ message: "verify otp error" }) }
}



// ================== RESET PASSWORD ==================

 const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and reset flags
    user.password = hashedPassword;
    user.isOtpVerified = false; // reset flag so OTP can’t be reused
    await user.save();

    return res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export { signup, signIn, logout ,sendOtp, verifyOtp, resetPassword};
