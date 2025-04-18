
import { OTP } from "../models/otp.js";
import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";

// Send OTP to user's email
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }


    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Set OTP expiration time (10 minutes from now)
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // Save OTP to the database
    await OTP.create({
      email,
      otp,
      expiresAt,
    });

    // Send OTP via email
    await sendMail(email, "Your OTP Code", otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. It is valid for 10 minutes.",
    });
  } catch (error) {
    console.error("Error in sendOtp:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending OTP. Please try again later.",
    });
  }
};


// Verify OTP
const verifyOtp = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      // Ensure email and OTP are provided
      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }
  
      // Find OTP record for the email
      const otpRecord = await OTP.findOne({ email });
  
      // If OTP record doesn't exist
      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: "OTP not found. Please request a new one.",
        });
      }
  
      // Check if OTP has expired
      if (otpRecord.expiresAt < Date.now()) {
        return res.status(400).json({
          success: false,
          message: "OTP expired. Please request a new one.",
        });
      }
  
      // Ensure OTP comparison is done correctly (strip spaces and make sure both are strings)
      const providedOtp = otp.toString().trim();
      const storedOtp = otpRecord.otp.toString().trim();
  
      // Check if the provided OTP matches the stored OTP
      if (providedOtp !== storedOtp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP. Please try again.",
        });
      }
  
      // OTP is valid, but do not delete OTP record
      res.status(200).json({
        success: true,
        message: "OTP verified successfully.",
      });
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      res.status(500).json({
        success: false,
        message: "An error occurred while verifying OTP. Please try again later.",
      });
    }
  };
  

export {sendOtp, verifyOtp};