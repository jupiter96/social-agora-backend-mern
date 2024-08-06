import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  HealthCheck,
  SearchUser,
  followUnFollowUser,
  freezeAccount,
  getCurrentUser,
  getSuggestedUsers,
  getUserProfile,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/profile/:query").get(getUserProfile);

router.route("/search/:uid").get(SearchUser);

router.route("/get-current-user").get(verifyJWT, getCurrentUser);

router.route("/suggested").get(verifyJWT, getSuggestedUsers);

router.route("/signup").post(signupUser);

router.route("/login").post(loginUser);

router.route("/logout").post(logoutUser);

router.route("/follow/:id").post(verifyJWT, followUnFollowUser);

router.route("/update/:id").put(verifyJWT, updateUser);

router.route("/freeze").put(verifyJWT, freezeAccount);

router.route("/health-check").get(HealthCheck);

export default router;
