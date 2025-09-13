import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass:  process.env.PASS,
  },
});

export const sendMailOtp = async (to,otp) => {
  await transporter.sendMail({
    from: `"MdSamir Support" <${process.env.EMAIL}>`,
    to,
    subject: "🔐 Your One-Time Password (OTP) for Reset Password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fafafa;">
        <h2 style="color: #333; text-align: center;">Account Verification for Reset Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to complete your verification:</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; font-size: 24px; letter-spacing: 4px; font-weight: bold; color: #2c3e50; padding: 10px 20px; border: 2px dashed #3498db; border-radius: 6px; background: #f0f8ff;">
            ${otp}
          </span>
        </div>
        
        <p style="color: #e74c3c; font-weight: bold;">⚠️ This OTP will expire in 5 minutes.</p>
        
        <p>If you did not request this, you can safely ignore this email.</p>
        <p style="margin-top: 30px;">Best regards,<br><strong>MdSamir Support Team</strong></p>
      </div>
    `,
  });
  

} 