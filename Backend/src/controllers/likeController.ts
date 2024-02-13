import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { VideoLike } from "../models/videoLikeModal.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import mongoose, { isValidObjectId } from "mongoose";
import { CommentLike } from "../models/commentLikeModal.ts";
import { Comment } from "../models/commentModel.ts";
import {Tweet} from "../models/tweetModel.ts"
import {TweetLike} from "../models/tweetLikeModal.ts"
import { UserRequest } from "../constants.ts";


export const toggleVideoLike = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }

    // Get user from request
    const user = req.user;

    // Check if user has already liked the video
    const userHasLiked = await VideoLike.findOne({
      videoId: videoId,
      userId: user._id,
    });

    if (userHasLiked) {
      // User has already liked, so remove like
      await userHasLiked.remove();
    } else {
      // User has not liked yet, so add a like
      await VideoLike.create({ videoId: videoId, userId: user._id });
    }

    return res.json(new ApiResponse(200, userHasLiked));
  }
);

export const toggleCommentLike = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { commentId } = req.params;
    //TODO: toggle like on comment
    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid comment id");
    }
    //TODO: get comment from db
    //TODO: toggle like on comment
    //TODO: return like status
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }
    const user = req.user;
    const userHasLiked = await CommentLike.findOne({
      commentId: commentId,
      userId: user._id,
    });
    if (userHasLiked) {
      // User has already liked, so remove like
      await userHasLiked.remove();
    } else {
      // User has not liked yet, so add a like
      await CommentLike.create({ commentId: commentId, userId: user._id });
    }

    return res.json(
      new ApiResponse(200, userHasLiked, "user like the comment successfully")
    );
  }
);

export const toggleTweetLike = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet
    if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid tweet id");
    }
    //TODO: get tweet from db
    //TODO: toggle like on tweet
    //TODO: return like status
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      throw new ApiError(404, "Tweet not found");
    }
    const user = req.user;
    const userHasLiked = await TweetLike.findOne({
      tweetId: tweetId,
      userId: user._id,
    });
    if (userHasLiked) {
      // User has already liked, so remove like
      await userHasLiked.remove();
    } else {
      // User has not liked yet, so add a like
      await TweetLike.create({ tweetId: tweetId, userId: user._id });
    }
    return res.json(
      new ApiResponse(200, userHasLiked, "user like the tweet successfully")
    );
  }
);

export const getLikedVideos = asyncHandler(async (req: UserRequest, res: Response) => {
  //TODO: get all liked videos
  const user = req.user;
  const likedVideos = await VideoLike.find({ userId: user._id });
  return res.json(new ApiResponse(200, likedVideos));
});

export const getLikedComments = asyncHandler(
  async (req: UserRequest, res: Response) => {
    //TODO: get all liked comments
    const user = req.user;
    const likedComments = await CommentLike.find({ userId: user._id });
    return res.json(new ApiResponse(200, likedComments));
  }
);

export const getLikedTweets = asyncHandler(async (req: UserRequest, res: Response) => {
  //TODO: get all liked tweets
  const user = req.user;
  const likedTweets = await TweetLike.find({ userId: user._id });
  return res.json(new ApiResponse(200, likedTweets));
});
