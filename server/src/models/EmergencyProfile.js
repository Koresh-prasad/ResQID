import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: String,
    relationship: String,
    mobile: String
  },
  { _id: false }
);

const emergencyProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: String,
    dateOfBirth: String,
    gender: String,
    bloodGroup: String,
    address: String,
    allergies: String,
    diseases: String,
    medications: String,
    organDonor: { type: Boolean, default: false },
    contacts: [contactSchema],
    insuranceDetails: String,
    vehicleNumber: String,
    qrUniqueId: { type: String, unique: true, sparse: true },
    qrUpdatedAt: Date,
    lastUpdated: Date
  },
  { timestamps: true }
);

export default mongoose.model('EmergencyProfile', emergencyProfileSchema);
