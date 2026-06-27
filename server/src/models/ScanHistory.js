import mongoose from 'mongoose';

const scanHistorySchema = new mongoose.Schema(
  {
    qrUniqueId: String,
    ip: String,
    userAgent: String,
    city: String
  },
  { timestamps: true }
);

export default mongoose.model('ScanHistory', scanHistorySchema);
