import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
  {
    video: {
      type: String, //cloudaniry
      required: true,
    },
    thumbnail: {
      type: String, //cloudaniry
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, //cloudinary will send this to you
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userViews: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    }
  },
  {
    timestamps: true,
  }
);
videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);
