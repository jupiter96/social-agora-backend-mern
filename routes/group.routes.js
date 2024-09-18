import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getGroups,
  getstatistics,
  getGroup,
  createGroup,
  deleteGroup,
  editGroup
} from "../controllers/group.controller.js";

const router = express.Router();

router.route("/getgroups").get(verifyJWT, getGroups);

router.route("/getgroupstatistics").get(getstatistics);

router.route("/:id").get(getGroup);

router.route("/create").post(verifyJWT, createGroup);

router.route("/:id").delete(verifyJWT, deleteGroup);

router.route("/editgroup/:id").put(verifyJWT, editGroup);

export default router;
