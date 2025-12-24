import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

/* ================= PRIVATE CHAT ================= */

export const getUsersForSidebar = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.log("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      isGroup: false,
      $or: [
        { senderId: myId, receiverId: id },
        { senderId: id, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error fetching messages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id } = req.params;

    let imageUrl;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const message = await Message.create({
      senderId: req.user._id,
      receiverId: id,
      text,
      image: imageUrl,
      isGroup: false,
    });

    const socketId = getReceiverSocketId(id);
    if (socketId) {
      io.to(socketId).emit("newMessage", message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.log("Error sending message:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= GROUP CHAT ================= */

export const createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;

    if (!groupName || members.length < 2) {
      return res
        .status(400)
        .json({ message: "Group name & minimum 2 members required" });
    }

    const groupId = Date.now().toString();
    const allMembers = [...members, req.user._id];

    await User.updateMany(
      { _id: { $in: allMembers } },
      { $push: { groups: { groupId, groupName } } }
    );

    res.status(201).json({ groupId, groupName });
  } catch (error) {
    console.log("Error creating group:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("groups");
    res.status(200).json(user.groups || []);
  } catch (error) {
    console.log("Error fetching groups:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await Message.find({
      groupId,
      isGroup: true,
    })
      .populate("senderId", "fullName profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error fetching group messages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { groupId } = req.params;

    let imageUrl;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const message = await Message.create({
      senderId: req.user._id,
      groupId,
      text,
      image: imageUrl,
      isGroup: true,
    });

    const users = await User.find({ "groups.groupId": groupId });

    users.forEach((user) => {
      const socketId = getReceiverSocketId(user._id.toString());
      if (socketId) {
        io.to(socketId).emit("newGroupMessage", message);
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.log("Error sending group message:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
