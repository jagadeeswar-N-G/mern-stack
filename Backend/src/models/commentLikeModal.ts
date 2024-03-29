import mongoose, { Schema } from "mongoose";
import { z } from "zod";


const commetLikeSchema = new mongoose.Schema(
  {
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);


export const CommentLike = mongoose.model("commetLike", commetLikeSchema);
