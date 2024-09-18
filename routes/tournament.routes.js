import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getTournaments,
  getstatistics,
  getTournament,
  createTournament,
  deleteTournament,
  editTournament
} from "../controllers/tournament.controller.js";

const router = express.Router();

router.route("/gettournaments").get(verifyJWT, getTournaments);

router.route("/gettournamentstatistics").get(getstatistics);

router.route("/:id").get(getTournament);

router.route("/create").post(verifyJWT, createTournament);

router.route("/:id").delete(verifyJWT, deleteTournament);

router.route("/edittournament/:id").put(verifyJWT, editTournament);

export default router;
