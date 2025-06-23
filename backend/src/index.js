import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.route.js";
import {app , server , io} from "./lib/socket.js"




const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

// Handle preflight requests
app.options('*', cors());

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? ["https://rtchatapp.netlify.app", "http://localhost:5173"]
      : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Backend is running successfully!" });
});

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
