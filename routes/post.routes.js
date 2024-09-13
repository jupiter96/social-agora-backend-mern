import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPost,
  deletePost,
  getFeedPosts,
  getPost,
  getUserPosts,
  likeUnlikePost,
  replyToPost,
  deleteFeed,
  editfeed,
  getstatistics
} from "../controllers/post.controller.js";

const router = express.Router();

router.route("/feed").get(verifyJWT, getFeedPosts);

router.route("/getfeedstatistics").get(getstatistics);

router.route("/:id").get(getPost);

router.route("/user/:username").get(verifyJWT, getUserPosts);

router.route("/create").post(verifyJWT, createPost);

router.route("/:id").delete(verifyJWT, deletePost);

router.route("/deletefeed/:id").delete(verifyJWT, deleteFeed);

router.route("/editfeed/:id").put(verifyJWT, editfeed);

router.route("/like/:id").put(verifyJWT, likeUnlikePost);

router.route("/reply/:id").put(verifyJWT, replyToPost);

export default router;
