import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.ts";
import { User } from "../models/userModel.ts";
import { uploadOnCloudinary } from "../utils/cloudinary.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import jwt from "jsonwebtoken";

export const getChannelStats = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
});

export const getChannelVideos = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Get all the videos uploaded by the channel
});
