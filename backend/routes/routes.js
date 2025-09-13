import express  from 'express';
import { logout, resetPassword, sendOtp, signIn, signup, verifyOtp } from '../controllers/auth.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signIn);
router.get('/logout',logout);
router.post('/send-otp',sendOtp);
router.post('/verify-otp',verifyOtp);
router.post("/reset-password", resetPassword);

export default router;