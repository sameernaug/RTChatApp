import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://rtchatapp-f7lv.onrender.com/api",
  // baseURL: "http://localhost:8080/api",
  withCredentials: true,
});