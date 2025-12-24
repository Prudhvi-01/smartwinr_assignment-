import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // private chat
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // group chat
    groupId: {
      type: String,
    },

    isGroup: {
      type: Boolean,
      default: false,
    },

    text: {
      type: String,
    },

    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// ✅ SAFE MODEL EXPORT (prevents overwrite)
const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
