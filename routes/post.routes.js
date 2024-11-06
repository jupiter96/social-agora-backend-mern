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
  getstatistics,
  getHashTag,
  createHashTag,
  editHashTag,
  deleteHashTag,
  getUserHashTag
} from "../controllers/post.controller.js";

const router = express.Router();

router.route("/feed").get(verifyJWT, getFeedPosts);

router.route("/getfeedstatistics").get(getstatistics);

router.route("/gethashtag").get(getHashTag);

router.route("/:id").get(getPost);

router.route("/getuserhashtag/:id").get(getUserHashTag);

router.route("/user/:username").get(verifyJWT, getUserPosts);

router.route("/create").post(verifyJWT, createPost);

router.route("/createhashtag").post(verifyJWT, createHashTag);

router.route("/:id").delete(verifyJWT, deletePost);

router.route("/deletehashtag/:id").delete(verifyJWT, deleteHashTag);

router.route("/deletefeed/:id").delete(verifyJWT, deleteFeed);

router.route("/editfeed/:id").put(verifyJWT, editfeed);

router.route("/edithashtag/:id").put(verifyJWT, editHashTag);

router.route("/like/:id").put(verifyJWT, likeUnlikePost);

router.route("/reply/:id").put(verifyJWT, replyToPost);

export default router;
