import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.ts";
import { User } from "../models/userModel.ts";
import { uploadOnCloudinary } from "../utils/cloudinary.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import {Subscriber} from "../models/subscriptionModel.ts"


interface userRequest extends Request {
  user?: any;
}
export const toggleSubscription = asyncHandler(
  async (req: userRequest, res: Response) => {
    
  }
);

// controller to return subscriber list of a channel
export const getUserChannelSubscribers = asyncHandler(
  async (req: userRequest, res: Response) => {
    const { channelId } = req.params;
  }
);

// controller to return channel list to which user has subscribed
export const getSubscribedChannels = asyncHandler(
  async (req: userRequest, res: Response) => {
    const { subscriberId } = req.params;
  }
);
