import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getGroup
} from "../controllers/group.controller.js";

const router = express.Router();

router.route("/getgroup").get(verifyJWT, getGroup);

export default router;
