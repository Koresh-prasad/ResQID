import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profilePicture: { type: String, default: '' },
    resetToken: String,
    resetTokenExpiry: Date,
    settings: {
      darkMode: { type: Boolean, default: false },
      language: { type: String, default: 'en' },
      notifications: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
