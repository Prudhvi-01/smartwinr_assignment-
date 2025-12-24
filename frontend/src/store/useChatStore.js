import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  // ================= STATE =================
  messages: [],
  users: [],
  groups: [],
  selectedUser: null,
  selectedGroup: null,

  isUsersLoading: false,
  isMessagesLoading: false,

  // ================= USERS =================
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ================= GROUPS =================
  getGroups: async () => {
    try {
      const res = await axiosInstance.get("/messages/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load groups");
    }
  },

  createGroup: async (groupName, members) => {
    try {
      const res = await axiosInstance.post("/messages/group", {
        groupName,
        members,
      });

      toast.success("Group created successfully");

      set((state) => ({
        groups: [...state.groups, res.data],
      }));

      return res.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create group"
      );
    }
  },

  // ================= PRIVATE CHAT =================
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  // ================= GROUP CHAT =================
  getGroupMessages: async (groupId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/group/${groupId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load group messages"
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendGroupMessage: async (groupId, messageData) => {
    const { messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/group/send/${groupId}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to send group message"
      );
    }
  },

  // ================= SOCKET =================
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      set({ messages: [...get().messages, newMessage] });
    });

    socket.on("newGroupMessage", (newMessage) => {
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("newGroupMessage");
  },

  // ================= SELECTORS =================
  setSelectedUser: (selectedUser) =>
    set({
      selectedUser,
      selectedGroup: null,
      messages: [],
    }),

  setSelectedGroup: (selectedGroup) =>
    set({
      selectedGroup,
      selectedUser: null,
      messages: [],
    }),
}));
