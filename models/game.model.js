import mongoose from "mongoose";

const gameSchema = mongoose.Schema(
  {
    game_name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    group: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Group",
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
