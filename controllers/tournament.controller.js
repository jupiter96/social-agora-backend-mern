import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Tournament from "../models/tournament.model.js";


const createTournament = async (req, res) => {
  try {
    const { title, adminUser, type, description, start_time, end_time, fee, reward, limit, members, status } = req.body;
    let { imgUrl } = req.body;

    if (imgUrl) {
      const uploadedResponse = await cloudinary.uploader.upload(imgUrl);
      imgUrl = uploadedResponse.secure_url;
    }
    const newtournament = new Tournament({ title, adminUser, type, description, start_time, end_time, fee, reward, limit, members, status, imgUrl });
    await newtournament.save();

    res.status(200).json(newtournament);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const editTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, adminUser, type, description, start_time, end_time, fee, reward, limit, members, status } = req.body;
    let { imgUrl } = req.body;

    let tournament = await Tournament.findById(id);

    if (!tournament) {
      return res.status(404).json({ error: "tournament not found" });
    }
    if (imgUrl.includes("base64")) {
      if (tournament.imgUrl) {
        await cloudinary.uploader.destroy(
          tournament.imgUrl.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(imgUrl);
      imgUrl = uploadedResponse.secure_url;
    }
    
    tournament.title = title || tournament.title;
    tournament.imgUrl = imgUrl || tournament.imgUrl;
    tournament.adminUser = adminUser || tournament.adminUser;
    tournament.description = description || tournament.description;
    tournament.type = type || tournament.type;
    tournament.start_time = start_time || tournament.start_time;
    tournament.end_time = end_time || tournament.end_time;
    tournament.fee = fee || tournament.fee;
    tournament.reward = reward || tournament.reward;
    tournament.limit = limit || tournament.limit;
    tournament.members = members || tournament.members;
    tournament.status = status || tournament.status;
    tournament = await tournament.save();

    res.status(200).json(tournament);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTournaments = async (req, res) => {
  try {
    const tournamentList = await Tournament.find().sort({
        createdAt: -1,
      });
    res.status(200).json(tournamentList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: "tournament not found" });
    }

    if (tournament.imgUrl) {
      const imgId = tournament.imgUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Tournament.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "tournament deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getstatistics = async (req, res) => {
  try {
    const tournamentCount = await Tournament.countDocuments();
    res.status(200).json({tournamentCount: tournamentCount});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({ error: "tournament not found" });
    }

    res.status(200).json(tournament);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export {
  getTournaments,
  getstatistics,
  createTournament,
  editTournament,
  getTournament,
  deleteTournament
};
