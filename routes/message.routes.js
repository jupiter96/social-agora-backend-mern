import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.route("/conversations").get(verifyJWT, getConversations);

router.route("/:otherUserId").get(verifyJWT, getMessages);

router.route("/").post(verifyJWT, sendMessage);

export default router;
