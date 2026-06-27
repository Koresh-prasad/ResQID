import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    otp: { type: String, required: true },
    expiryTime: { type: Date, required: true },
    purpose: { type: String, default: 'full-profile' },
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('OTP', otpSchema);
