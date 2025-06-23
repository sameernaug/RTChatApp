import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://rtchatapp-new.onrender.com/api",
  // baseURL: "http://localhost:8080/api",
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    console.log("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  (error) => {
    console.log("Response error:", error);
    return Promise.reject(error);
  }
);

// Test function to check backend connectivity
export const testBackendConnection = async () => {
  try {
    console.log("Testing backend connection...");
    const response = await fetch("https://rtchatapp-new.onrender.com/api/auth/check", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    console.log("Backend test response:", response.status, response.statusText);
    return response.ok;
  } catch (error) {
    console.log("Backend test failed:", error);
    return false;
  }
};