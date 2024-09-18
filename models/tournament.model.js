import mongoose from "mongoose";

const tournamentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    adminUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      default: 'Individual'
    },
    imgUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    reward: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    status: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Tournament = mongoose.model("Tournament", tournamentSchema);

export default Tournament;
