import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getGames,
  getstatistics,
  getGame,
  createGame,
  deleteGame,
  editGame
} from "../controllers/game.controller.js";

const router = express.Router();

router.route("/getgames").get(verifyJWT, getGames);

router.route("/getgamestatistics").get(getstatistics);

router.route("/:id").get(getGame);

router.route("/create").post(verifyJWT, createGame);

router.route("/:id").delete(verifyJWT, deleteGame);

router.route("/editgame/:id").put(verifyJWT, editGame);

export default router;
