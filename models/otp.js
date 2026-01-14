import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  code: String,
  expiresAt: Date,
});

export default mongoose.model("Otp", otpSchema);
