import mongoose from "mongoose";

const hashtagSchema = mongoose.Schema(
  {
    hashtag_name: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const HashTag = mongoose.model("HashTag", hashtagSchema);

export default HashTag;
