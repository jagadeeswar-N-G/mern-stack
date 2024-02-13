import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videos: {
     type : [{ type: Schema.Types.ObjectId, ref: "Video" }],
     default: [],
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);


export const Playlist = mongoose.model("Playlist", playlistSchema);
