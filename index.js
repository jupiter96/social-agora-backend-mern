import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
import connectDB from "./db/connectDB.js";
import cors from "cors";
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

// job.start();
// not using cron jobs due to instance hours

connectDB();

const PORT = process.env.PORT || 8080;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

//Routes
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import messageRoutes from "./routes/message.routes.js";
import groupRoutes from "./routes/group.routes.js";
import gameRoutes from "./routes/game.routes.js";
import tournamentRoutes from "./routes/tournament.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import settingRoutes from "./routes/setting.routes.js";

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/messages", messageRoutes);
app.use("/groups", groupRoutes);
app.use("/games", gameRoutes);
app.use("/tournaments", tournamentRoutes);
app.use("/payments", paymentRoutes);
app.use("/notifications", notificationRoutes);
app.use("/settings", settingRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
