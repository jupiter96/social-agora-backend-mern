import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Payment from "../models/payment.model.js";
import generateToken from "../utils/helpers/generateToken.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getUserProfile = async (req, res) => {
  const { query } = req.params;
  try {
    let user;

    // query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      // query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUserProfile: ", err.message);
  }
};

const signupUser = async (req, res) => {
  try {
    let { name, email, username, password, profilePic, bio, role, member, expireDate, level, exp, coin, group, tournament } = req.body;
    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(200).json({ error: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const images = [
      "https://res.cloudinary.com/drv3pneh8/image/upload/v1726732773/oscpozuoes0ybpkgyqr2.png",
      "https://res.cloudinary.com/drv3pneh8/image/upload/v1726732773/ieitybjoogznwt1ulw8b.png",
      "https://res.cloudinary.com/drv3pneh8/image/upload/v1726732775/kbwq51itm7qxvlfrsr3f.png",
      "https://res.cloudinary.com/drv3pneh8/image/upload/v1726732778/zvxobzta0rgwkxv58qnm.png"];

    if (profilePic) {
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    const newUser = new User({
      name,
      email,
      bio,
      role: role? role: 'User',
      member: member? member: 'Free',
      plan: '',
      expireDate: expireDate? expireDate: null,
      username,
      profilePic: profilePic ? profilePic : images[username.length % 4],
      password: hashedPassword,
      level: level ? level : 1,
      exp: exp ? exp : 100,
      coin: coin ? coin : 0,
      group: group ? group : 0,
      tournament: tournament ? tournament : 0,
    });
    await newUser.save();

    if (newUser) {
      const token = generateToken(newUser._id, res);

      res.status(200).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
        role: newUser.role,
        member: newUser.member,
        plan: newUser.plan,
        expireDate: newUser.expireDate,
        level: newUser.level,
        exp: newUser.exp,
        coin: newUser.coin,
        group: newUser.group,
        tournament: newUser.tournament,
        token: token,
      });
    } else {
      res.status(200).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};



const editUser = async (req, res) => {
  let { name, email, username, password, profilePic, bio, role, member, expireDate, level, exp, coin, group, tournament } = req.body;
  const images = [
    "https://res.cloudinary.com/drv3pneh8/image/upload/v1726732773/oscpozuoes0ybpkgyqr2.png",
    "https://res.cloudinary.com/drv3pneh8/image/upload/v1726732773/ieitybjoogznwt1ulw8b.png",
    "https://res.cloudinary.com/drv3pneh8/image/upload/v1726732775/kbwq51itm7qxvlfrsr3f.png",
    "https://res.cloudinary.com/drv3pneh8/image/upload/v1726732778/zvxobzta0rgwkxv58qnm.png"];
  const userId = req.params.id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });
    
    if(password != "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic.includes("base64")) {
      if (user.profilePic) {
        if(!images.includes(user.profilePic)){
          await cloudinary.uploader.destroy(
            user.profilePic.split("/").pop().split(".")[0]
          );
        }
      }

      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    user.role = role || user.role;
    user.member = member || user.member;
    user.expireDate = expireDate || user.expireDate;
    user.level = level || user.level;
    user.exp = exp || user.exp;
    user.coin = coin || user.coin;
    user.group = group || user.group;
    user.tournament = tournament || user.tournament;

    user = await user.save();

    // Find all posts that this user replied and update username and userProfilePic fields
    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    // password should be null in response
    user.password = null;

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updateUser: ", err.message);
  }
};

const buyMembership = async (req, res) => {
  const monthlyPriceId = 'price_1QI3JJRqSOK3QhQfR99YAk2j';
  const annualPriceId = 'price_1QI3KHRqSOK3QhQfMCfaG7JS';
  const { email, name, paymentMethodId, subscriptionType } = req.body; // subscriptionType can be 'monthly' or 'annual'
  

  try {
    const customer = await stripe.customers.create({
      email,
      name,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    console.log('Customer ID:', customer.id);
    
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: subscriptionType === 'monthly' ? monthlyPriceId : annualPriceId }],
      expand: ['latest_invoice.payment_intent'],
    });
    console.log('subscription.latest_invoice.payment_intent.client_secret', subscription.latest_invoice.payment_intent.client_secret);

    res.status(200).send({
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).send({ error: 'Subscription creation failed' });
  }
};

const updateMembership = async (req, res) => {
  const { subscriptionType, userId } = req.body;
  const currentDate = new Date();

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if(subscriptionType === 'monthly'){
      user.exp = user.exp + 100;
      user.member = 'Paid';
      user.plan = 'Monthly';
      currentDate.setMonth(currentDate.getMonth() + 1);
      user.expireDate = [currentDate.toISOString()];
    }else if(subscriptionType === 'annual'){
      user.exp = user.exp + 500;
      user.member = 'Paid';
      user.plan = 'Annual';
      currentDate.setFullYear(currentDate.getFullYear() + 1);
      user.expireDate = [currentDate.toISOString()];
    }

    user = await user.save();

    const newTransaction = new Payment({
      user: userId,
      amount: subscriptionType === 'monthly' ? 3.99 : 39.99,
      plan: subscriptionType === 'monthly' ? "Monthly Membership":"Annual Membership",
      status: "Completed"
    });
    await newTransaction.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updateMembership: ", err.message);
  }
};

const buyCoin = async (req, res) => {
  const { amount, currency, userId } = req.body;

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency,
    payment_method_types: ['card'],
  });

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};


const updateCoin = async (req, res) => {
  const { coins, userId } = req.body;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    user.exp = user.exp + (coins*2);
    if(coins === 99){
      user.coin = user.coin + 100;
    }else if(coins === 198){
      user.coin = user.coin + 200;
    }else if(coins === 470){
      user.coin = user.coin + 500;
    }else if(coins === 941){
      user.coin = user.coin + 1000;
    }else if(coins === 4699){
      user.coin = user.coin + 5000;
    }

    user = await user.save();

    const newTransaction = new Payment({
      user: userId,
      amount: Number(coins)/100,
      plan: "Agora Coin",
      status: "Completed"
    });
    await newTransaction.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updatecoin: ", err.message);
  }
};

const upgradeMember = async (req, res) => {
  let { name, email, username, password, profilePic, bio, role, member, expireDate, level, exp, coin, group, tournament } = req.body;
  const images = [
    "https://res.cloudinary.com/drv3pneh8/image/upload/v1726732773/oscpozuoes0ybpkgyqr2.png",
    "https://res.cloudinary.com/drv3pneh8/image/upload/v1726732773/ieitybjoogznwt1ulw8b.png",
    "https://res.cloudinary.com/drv3pneh8/image/upload/v1726732775/kbwq51itm7qxvlfrsr3f.png",
    "https://res.cloudinary.com/drv3pneh8/image/upload/v1726732778/zvxobzta0rgwkxv58qnm.png"];
  const userId = req.params.id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });
    
    if(password != "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic.includes("base64")) {
      if (user.profilePic) {
        if(!images.includes(user.profilePic)){
          await cloudinary.uploader.destroy(
            user.profilePic.split("/").pop().split(".")[0]
          );
        }
      }

      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    user.role = role || user.role;
    user.member = member || user.member;
    user.expireDate = expireDate || user.expireDate;
    user.level = level || user.level;
    user.exp = exp || user.exp;
    user.coin = coin || user.coin;
    user.group = group || user.group;
    user.tournament = tournament || user.tournament;

    user = await user.save();

    // Find all posts that this user replied and update username and userProfilePic fields
    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    // password should be null in response
    user.password = null;

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updateUser: ", err.message);
  }
};



const updateMember = async (req, res) => {
  const { coins, userId } = req.body;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    user.exp = user.exp + (coins*2);
    user.coin = user.coin + coins;

    user = await user.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updatecoin: ", err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect)
      return res.status(200).json({ error: "Invalid username or password" });

    if (user.isFrozen) {
      user.isFrozen = false;
      await user.save();
    }
    if (user) {
      user.exp += 5
      await user.save();
    }

    const token = generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
      role: user.role,
      member: user.member,
      plan: user.plan,
      expireDate: user.expireDate,
      level: user.level,
      exp: user.exp,
      coin: user.coin,
      group: user.group,
      tournament: user.tournament,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in loginUser: ", error.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};

const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in followUnFollowUser: ", err.message);
  }
};

const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req?.body;
  let { profilePic } = req?.body;

  const userId = req?.user?._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    // Find all posts that this user replied and update username and userProfilePic fields
    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    // password should be null in response
    user.password = null;

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updateUser: ", err.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getSuggestedUsers = async (req, res) => {
  try {
    // exclude the current user from suggested users array and exclude users that current user is already following
    const userId = req.user._id;

    const usersFollowedByYou = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id)
    );
    // const suggestedUsers = filteredUsers.slice(0, 4);

    filteredUsers.forEach((user) => (user.password = null));

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getstatistics = async (req, res) => {
  try {
    // Get total user count
    const totalUserCount = await User.countDocuments();
  
    // Get the start of the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1); // Set to the first day of the current month
    startOfMonth.setHours(0, 0, 0, 0); // Set hours to 00:00:00 for accurate comparison
  
    // Get user count registered this month
    const monthlyUserCount = await User.countDocuments({
      createdAt: { $gte: startOfMonth } // Filter users created from the start of the month
    });
    res.status(200).json({ totalUser: totalUserCount, monthlyUserCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getCurrentUser = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const user = await User.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const freezeAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    user.isFrozen = true;
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const SearchUser = async (req, res) => {
  try {
    const { uid } = req?.params;

    const user = await User.find({
      $or: [
        {
          username: { $regex: uid, $options: 'i' },
        },
        {
          email: { $regex: uid, $options: 'i' },
        },
        {
          bio: { $regex: uid, $options: 'i' },
        },
        {
          name: { $regex: uid, $options: 'i' },
        },
      ],
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(200).json({ message: "No User found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const HealthCheck = async (req, res) => {
  try {
    res.status(200).json({ message: "Health Tested" });
  } catch (error) {
    console.log(error);
  }
};

export {
  getUserProfile,
  getAllUsers,
  getstatistics,
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  editUser,
  deleteUser,
  getSuggestedUsers,
  freezeAccount,
  getCurrentUser,
  SearchUser,
  HealthCheck,
  buyCoin,
  updateCoin,
  upgradeMember,
  updateMember,
  buyMembership,
  updateMembership,
};
