import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profilePic: {
      type: String,
      default: "",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    groups: [
      {
        groupId: String,
        groupName: String,
      },
    ],
  },
  { timestamps: true }
);

// ✅ SAFE MODEL EXPORT (prevents overwrite)
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
