import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  createGroup,
  getGroupMessages,
  sendGroupMessage,
  getMyGroups,
} from "../controllers/message.controller.js";

const router = express.Router();

/* ================= STATIC ROUTES FIRST ================= */

// Users for sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Get all groups of logged-in user
router.get("/groups", protectRoute, getMyGroups);

/* ================= GROUP CHAT ROUTES ================= */

// Create group
router.post("/group", protectRoute, createGroup);

// Get group messages
router.get("/group/:groupId", protectRoute, getGroupMessages);

// Send group message
router.post("/group/send/:groupId", protectRoute, sendGroupMessage);

/* ================= DYNAMIC ROUTES LAST ================= */

// Private chat messages
router.get("/:id", protectRoute, getMessages);

// Send private message
router.post("/send/:id", protectRoute, sendMessage);

export default router;
