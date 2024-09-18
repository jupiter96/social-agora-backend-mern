import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  getstatistics,
  getNotification,
  createNotification,
  deleteNotification,
  editNotification
} from "../controllers/notification.controller.js";

const router = express.Router();

router.route("/getnotifications").get(verifyJWT, getNotifications);

router.route("/getnotificationstatistics").get(getstatistics);

router.route("/:id").get(getNotification);

router.route("/create").post(verifyJWT, createNotification);

router.route("/:id").delete(verifyJWT, deleteNotification);

router.route("/editnotification/:id").put(verifyJWT, editNotification);

export default router;
