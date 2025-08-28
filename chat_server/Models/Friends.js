// models/Friendship.js
import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema(
  {
    current: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Arkadaşlık isteğini gönderen kullanıcı
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // İsteği alan kullanıcı
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Friendship", friendshipSchema);
