import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/drv3pneh8/image/upload/v1722670019/y0mxqve6jthvktbgyojv.png",
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'User',
    },
    member: {
      type: String,
      default: 'Free'
    },
    plan: {
      type: String,
      default: 'Monthly'
    },
    level: {
      type: Number,
      default: 1
    },
    exp: {
      type: Number,
      default: 0
    },
    coin: {
      type: Number,
      default: 0
    },
    group: {
      type: Number,
      default: 0
    },
    tournament: {
      type: Number,
      default: 0
    },
    expireDate: {
      type: [String],
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  // Calculate level based on exp
  this.level = Math.floor(this.exp / 200);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
