import { v2 as cloudinary } from "cloudinary";
import Game from "../models/game.model.js";
import Category from "../models/category.model.js";

const createGame = async (req, res) => {
  try {
    const { game_name, category, description } = req.body;
    let { imgUrl } = req.body;

    if (imgUrl) {
      const uploadedResponse = await cloudinary.uploader.upload(imgUrl);
      imgUrl = uploadedResponse.secure_url;
    }
    const newGame = new Game({ game_name, category, imgUrl, description });
    await newGame.save();

    res.status(200).json(newGame);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    const newCategory = new Category({ category_name });
    await newCategory.save();

    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const editGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { game_name, category, description } = req.body;
    let { imgUrl } = req.body;

    let game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    if (imgUrl.includes("base64")) {
      if (game.imgUrl) {
        await cloudinary.uploader.destroy(
          game.imgUrl.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(imgUrl);
      imgUrl = uploadedResponse.secure_url;
    }
    
    game.game_name = game_name || game.game_name;
    game.imgUrl = imgUrl || game.imgUrl;
    game.category = category || game.category;
    game.description = description || game.description;
    game = await game.save();

    res.status(200).json(game);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    let category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.category_name = category_name || category.category_name;
    category = await category.save();

    res.status(200).json(category);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGames = async (req, res) => {
  try {
    const gameList = await Game.find().sort({
        createdAt: -1,
      });
    res.status(200).json(gameList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categoryList = await Category.find().sort({
        createdAt: -1,
      });
    res.status(200).json(categoryList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    if (game.imgUrl) {
      const imgId = game.imgUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Game.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Game deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getstatistics = async (req, res) => {
  try {
    const gameCount = await Game.countDocuments();
    res.status(200).json({gameCount: gameCount});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export {
  getGames,
  getstatistics,
  createGame,
  editGame,
  getGame,
  deleteGame,
  createCategory,
  getCategories,
  deleteCategory,
  editCategory
};
