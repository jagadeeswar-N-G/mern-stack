import mongoose, {Schema} from "mongoose";

const tweerLikeSchema = new mongoose.Schema({
    tweetId: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});

export const TweetLike = mongoose.model("TweetLike", tweerLikeSchema);