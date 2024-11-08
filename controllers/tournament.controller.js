import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Tournament from "../models/tournament.model.js";


const createTournament = async (req, res) => {
  try {
    const { title, adminUser, type, game, description, start_time, end_time, fee, reward, limit, members, status } = req.body;
    let { imgUrl } = req.body;

    if (imgUrl) {
      const uploadedResponse = await cloudinary.uploader.upload(imgUrl);
      imgUrl = uploadedResponse.secure_url;
    }
    const newtournament = new Tournament({ title, adminUser, type, game, description, start_time, end_time, fee, reward, limit, members, status, imgUrl });
    await newtournament.save();
    const user = await User.findById(adminUser);
    if (user) {
      user.exp += 100;
      user.coin -= 150;
      user.tournament += 1;
      await user.save();
    }

    res.status(200).json(newtournament);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const editTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, adminUser, type, game, description, start_time, end_time, fee, reward, limit, members, status } = req.body;
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
    tournament.game = game || tournament.game;
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
    // Get total tournament count
    const tournamentCount = await Tournament.countDocuments();
  
    // Get the start of the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1); // Set to the first day of the current month
    startOfMonth.setHours(0, 0, 0, 0); // Set hours to 00:00:00 for accurate comparison
  
    // Get tournament count added this month
    const monthlyTournamentCount = await Tournament.countDocuments({
      createdAt: { $gte: startOfMonth } // Filter tournaments created from the start of the month
    });
  
    res.status(200).json({ tournamentCount, monthlyTournamentCount });
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



const joinTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.body?.tournament_id);

    if (!tournament) {
      return res.status(404).json({ error: "tournament not found" });
    }
    tournament.members.push(req.body?.member_id);
    await tournament.save();

    const user = await User.findById(req.body?.member_id);
    if (user) {
      user.exp += 30;
      user.coin -= req.body?.fee;
      await user.save();
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
  joinTournament,
  deleteTournament
};
