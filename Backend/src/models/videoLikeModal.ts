import mongoose, {Schema} from "mongoose";

const videoLikeSchema = new mongoose.Schema({
    videoId: {
        type: Schema.Types.ObjectId,
        ref: "Video",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});


export const VideoLike = mongoose.model("VideoLike", videoLikeSchema);
