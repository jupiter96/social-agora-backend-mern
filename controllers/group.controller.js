import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Group from "../models/group.model.js";

const getGroup = async (req, res) => {
  try {
    // const userId = req.user._id;
    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({ error: "User not found" });
    // }

    // const following = user.following;

    // const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
    //   createdAt: -1,
    // });
    const groupList = await Group.find().sort({
        createdAt: -1,
      });
    res.status(200).json(groupList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getGroup
};
