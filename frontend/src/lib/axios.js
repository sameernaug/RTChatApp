import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://rtchatapp-f7lv.onrender.com/api",
  withCredentials: true,
});