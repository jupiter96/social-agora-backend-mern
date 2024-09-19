import { v2 as cloudinary } from "cloudinary";
import Group from "../models/group.model.js";

const createGroup = async (req, res) => {
  try {
    const { group_name, game, description, adminUser, members } = req.body;
    let { imgUrl } = req.body;

    if (imgUrl) {
      const uploadedResponse = await cloudinary.uploader.upload(imgUrl);
      imgUrl = uploadedResponse.secure_url;
    }
    const newGroup = new Group({ group_name, game, imgUrl, adminUser, description, members });
    await newGroup.save();

    res.status(200).json(newGroup);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const editGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { group_name, game, description, adminUser, members } = req.body;
    let { imgUrl } = req.body;

    let group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    if (imgUrl.includes("base64")) {
      if (group.imgUrl) {
        await cloudinary.uploader.destroy(
          group.imgUrl.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(imgUrl);
      imgUrl = uploadedResponse.secure_url;
    }
    
    group.group_name = group_name || group.group_name;
    group.imgUrl = imgUrl || group.imgUrl;
    group.game = game || group.game;
    group.adminUser = adminUser || group.adminUser;
    group.members = members || group.members;
    group.description = description || group.description;
    group = await group.save();

    res.status(200).json(group);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGroups = async (req, res) => {
  try {
    const groupList = await Group.find().sort({
        createdAt: -1,
      });
    res.status(200).json(groupList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.imgUrl) {
      const imgId = group.imgUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Group.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getstatistics = async (req, res) => {
  try {
    const groupCount = await Group.countDocuments();
    res.status(200).json({groupCount: groupCount});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export {
  getGroups,
  getstatistics,
  createGroup,
  editGroup,
  getGroup,
  deleteGroup
};