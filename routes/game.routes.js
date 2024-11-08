import express from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getGames,
  getstatistics,
  getGame,
  createGame,
  deleteGame,
  editGame,
  getCategories,
  createCategory,
  deleteCategory,
  editCategory
} from "../controllers/game.controller.js";

const router = express.Router();

router.route("/getgames").get(verifyJWT, getGames);

router.route("/getcategories").get(getCategories);

router.route("/getgamestatistics").get(getstatistics);

router.route("/:id").get(getGame);

router.route("/create").post(verifyJWT, createGame);

router.route("/addcategory").post(createCategory);

router.route("/editgame/:id").put(verifyJWT, editGame);

router.route("/editcategory/:id").put(editCategory);

router.route("/:id").delete(verifyJWT, deleteGame);

router.route("/category/:id").delete(deleteCategory);

export default router;
