import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { User } from "../models/userModel.ts";
import { uploadOnCloudinary } from "../utils/cloudinary.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


export const getVideoComments = asyncHandler(async (req: Request, res: Response) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  // TODO: add a comment to a video
});

export const updateComment = asyncHandler(async (req: Request, res: Response) => {
  // TODO: update a comment
});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  // TODO: delete a comment
});