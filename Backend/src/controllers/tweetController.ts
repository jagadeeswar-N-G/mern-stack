import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { User } from "../models/userModel.ts";
import { uploadOnCloudinary } from "../utils/cloudinary.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { Tweet } from "../models/tweetModel.ts";
import express, { Request, Response } from "express";

interface userRequest extends Request {
  user?: any
}
export const createTweet = asyncHandler(
  async (req: userRequest, res: Response) => {
    // TODO: Validate request
    // TODO: Create tweet
    // TODO: Save tweet
    // TODO: Return response
    const { content } = req.body as any;
    if (!content || content?.trim() === "") {
      return res.json(new ApiError(400, "Content is required"));
    }
    
    const tweetData = {
      content,
      ownerId: req.user._id,
    };

    const newTweet = await Tweet.create(tweetData);
    return res.status(201).json(new ApiResponse(201, newTweet));
  }
);
export const getUserTweets = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: get user tweets
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.json(new ApiError(400, "Invalid user id"));
    }

    const tweets = await Tweet.find({ ownerId: userId })
      .populate("ownerId", "username")
      .sort({ createdAt: -1 });

    return res.json(new ApiResponse(200, tweets));
  }
);

export const updateTweet = asyncHandler(
  async (req: userRequest, res: Response) => {
    //TODO: update tweet
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
      return res.json(new ApiError(400, "Invalid tweet id"));
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.json(new ApiError(404, "Tweet not found"));
    }

    if (tweet.ownerId.toString() !== req.user._id.toString()) {
      return res.json(new ApiError(401, "Unauthorized"));
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { content: req.body.content },
      { new: true }
    );

    return res.json(new ApiResponse(200, updatedTweet));
  }
);

export const deleteTweet = asyncHandler(
  async (req: userRequest, res: Response) => {
    //TODO: delete tweet
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
      return new ApiError(400, "Invalid tweet id");
    }

    const tweet = await Tweet.findById(tweetId);

    console.log(tweet);
    

    if (!tweet) {
      return res.json(new ApiResponse(200, "Tweet not found"));
    }

    if (tweet.ownerId.toString() !== req.user._id.toString()) {
      return res.json(new ApiError(401, "Unauthorized"));
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res.json(new ApiResponse(200, "Tweet deleted"));
  }
);
