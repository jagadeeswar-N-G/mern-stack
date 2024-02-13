import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { User } from "../models/userModel.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { Request, Response } from "express";

interface userRequest extends Request {
  user?: any;
}
export const getChannelStats = asyncHandler(
  async (req: userRequest, res: Response) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    // TODO: Get the channel videos
    // TODO: Get the channel subscribers
    // TODO: Get the channel comments
    // TODO: Get the channel likes
    const user = req.user._id;
    if (!isValidObjectId(user)) {
      throw new ApiError(400, "Invalid user id");
    }
  }
);

export const getChannelVideos = asyncHandler(
  async (req: userRequest, res: Response) => {
    // TODO: Get all the videos uploaded by the channel
    const user = req.user._id;
    if (!isValidObjectId(user)) {
      throw new ApiError(400, "Invalid user id");
    }
    const totalVideos = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "ownerId",
          as: "channelVideos",
        },
      },
      {
        $project: {
          channelVideos: 1,
        },
      },
    ]);
    return res.json(new ApiResponse(200, totalVideos, "Videos fetched successfully"));;
  }
);
