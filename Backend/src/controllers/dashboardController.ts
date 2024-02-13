import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
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
    const user = req.user;
    
  }
);

export const getChannelVideos = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Get all the videos uploaded by the channel
});
