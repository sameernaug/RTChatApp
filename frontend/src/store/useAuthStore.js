import { create } from "zustand";
import { axiosInstance, testBackendConnection } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client"
const BASE_URL = "https://rtchatapp-new.onrender.com/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket:[],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket()
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      console.log("signup data:", data);
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket()
    } catch (error) {
      console.log("Signup error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Signup failed";
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      console.log("Attempting login with data:", data);
      console.log("Making request to:", "https://rtchatapp-new.onrender.com/api/auth/login");
      
      const res = await axiosInstance.post("/auth/login", data);
      console.log("Login response:", res);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
get().connectSocket()
      
    } catch (error) {
      console.log("Login error details:", {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      });
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Logout failed";
      toast.error(errorMessage);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      const errorMessage = error.response?.data?.message || error.message || "Profile update failed";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket:()=>{
    const {authUser} = get();
    if(!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL,{
      query:{
        userId:authUser._id
      }
    });
    socket.connect();
    set({socket:socket});

    socket.on("getOnlineUsers" , (userIds)=>{
      set({onlineUsers:userIds})
    })
  },
  disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconnect();
  }

}));