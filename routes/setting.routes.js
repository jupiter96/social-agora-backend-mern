import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getBanners,
  createBanner,
  deleteBanner,
  editBanner
} from "../controllers/setting.controller.js";

const router = express.Router();

router.route("/banners/getbanners").get(verifyJWT, getBanners);

router.route("/banners/create").post(verifyJWT, createBanner);

router.route("/banners/:id").delete(verifyJWT, deleteBanner);

router.route("/banners/editbanner/:id").put(verifyJWT, editBanner);

export default router;
