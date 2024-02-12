import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { User } from "../models/userModel.ts";
import { uploadOnCloudinary } from "../utils/cloudinary.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


export const toggleVideoLike = asyncHandler(async (req : Request, res : Response) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
});

export const toggleCommentLike = asyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
});

export const toggleTweetLike = asyncHandler(async (req: Request, res: Response) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

export const getLikedVideos = asyncHandler(async (req: Request, res: Response) => {
  //TODO: get all liked videos
});