import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import HashTag from "../models/hashtag.model.js";

const createPost = async (req, res) => {
  try {
    const { postedBy, text, hashtag } = req.body;
    let { img, video } = req.body;
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "Postedby and text fields are required" });
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // if (user._id.toString() !== req.user._id.toString()) {
    //   return res.status(401).json({ error: "Unauthorized to create post" });
    // }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    
    if (video?.includes("base64")) {
      const uploadedResponse = await cloudinary.uploader.upload_large(video, 
        { resource_type: "video" });
        video = uploadedResponse.secure_url;
    }
    const newPost = new Post({ postedBy, text, img, video, hashtag, widthRatio: 1, heightRatio: 1 });
    await newPost.save();

    if (user) {
      user.exp += 10
      await user.save();
    }
    

    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const createHashTag = async (req, res) => {
  try {
    const { hashtag_name } = req.body;
    const newHashTag = new HashTag({ hashtag_name });
    await newHashTag.save();

    res.status(200).json(newHashTag);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteFeed = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const deleteHashTag = async (req, res) => {
  try {
    const hashtag = await HashTag.findById(req.params.id);
    if (!hashtag) {
      return res.status(404).json({ error: "hashtag not found" });
    }

    await HashTag.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "hashtag deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editfeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { postedBy, text, hashtag, createdAt } = req.body;
    let { img, video } = req.body;

    let post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (img?.includes("base64")) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }
    if (video?.includes("base64")) {
      const uploadedResponse = await cloudinary.uploader.upload_large(video, 
        { resource_type: "video" });
        video = uploadedResponse.secure_url;
    }
    
    post.text = text || post.text;
    post.hashtag = hashtag || post.hashtag;
    post.img = img || '';
    post.video = video || '';
    post.createdAt = createdAt || post.createdAt;
    post = await post.save();

    res.status(200).json(post);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editHashTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { hashtag_name } = req.body;

    let hashtag = await HashTag.findById(id);

    if (!hashtag) {
      return res.status(404).json({ error: "hashtag not found" });
    }

    hashtag.hashtag_name = hashtag_name || hashtag.hashtag_name;
    hashtag = await hashtag.save();

    res.status(200).json(hashtag);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);
    const user = await User.findById(userId);
    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      if (user) {
        user.exp += 5
        await user.save();
      }
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like post
      post.likes.push(userId);
      await post.save();
      if (user) {
        user.exp += 5
        await user.save();
      }
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const reply = { userId, text, userProfilePic, username };

    post.replies.push(reply);
    await post.save();
    const user = await User.findById(userId);
    if (user) {
      user.exp += 5
      await user.save();
    }

    res.status(200).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFeedPosts = async (req, res) => {
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
    const feedPosts = await Post.find().sort({
        createdAt: -1,
      });
    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getHashTag = async (req, res) => {
  try {
    const hash = await HashTag.find().sort({
        createdAt: -1,
      });
    res.status(200).json(hash);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserHashTag = async (req, res) => {
  try {
    const hash = await HashTag.find().sort({
        createdAt: -1,
      });
    const posts = await Post.find({postedBy: req.params.id});

    if (!posts) {
      return res.status(404).json({ error: "Post not found" });
    }

    const hashtagCounts = {};

    posts.forEach(post => {
      post.hashtag.forEach(hashtagId => {
        if (!hashtagCounts[hashtagId]) {
            hashtagCounts[hashtagId] = 0;
        }
        hashtagCounts[hashtagId]++;
    });
    });

    const popularHashtags = Object.entries(hashtagCounts)
        .map(([id, count], index) => {
            const hashtag = hash.filter(h => h._id.toString() === id);
            return { hashtagId: id, hashtag_name: hashtag[0]?.hashtag_name, count };
        })
        .sort((a, b) => b.count - a.count);
    res.status(200).json(popularHashtags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getstatistics = async (req, res) => {
  try {
    // Get total post count
    const postCount = await Post.countDocuments();
  
    // Get the start of the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1); // Set to the first day of the current month
    startOfMonth.setHours(0, 0, 0, 0); // Set hours to 00:00:00 for accurate comparison
  
    // Get post count added this month
    const monthlyPostCount = await Post.countDocuments({
      createdAt: { $gte: startOfMonth } // Filter posts created from the start of the month
    });
  
    res.status(200).json({ postCount, monthlyPostCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getUserPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ postedBy: user?._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ erroringetpost: error.message });
  }
};

export {
  createPost,
  getPost,
  deleteFeed,
  editfeed,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
  getstatistics,
  getHashTag,
  createHashTag,
  editHashTag,
  deleteHashTag,
  getUserHashTag
};
