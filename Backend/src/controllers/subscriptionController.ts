import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { User } from "../models/userModel.ts";
import { uploadOnCloudinary } from "../utils/cloudinary.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import {Subscriber} from "../models/subscriptionModel.ts"
import { UserRequest } from "../constants.ts";


export const toggleSubscription = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const {channelId} = req.params;
    if (!isValidObjectId(channelId)) {
      return res.json(new ApiError(400, "Invalid channel id"));
    }
    const userId = req.user._id;

    // check if channel not available
    const channel = await User.findById(channelId);
    if (!channel) {
      throw new ApiError(404, "Channel not find!");
    }

    // prevent subscribe to own channel
    if (channelId.toString() === userId) {
      throw new ApiError(400, "You cannot subscribe your own channel!");
    }

    // toggle the subscription
    const subscription = await Subscriber.findOne({ channel: channelId });
    console.log(subscription);
    
    let unSubscribe;
    let subscribe;

    if (subscription?.subscriber?.toString() === userId) {
      // un-subscribe
      unSubscribe = await Subscriber.findOneAndDelete({
        subscriber: userId,
        channel: channelId,
      });
    } else {
      // subscribe
      subscribe = await Subscriber.create({
        subscriber: userId,
        channel: channelId,
      });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          `${unSubscribe ? "unSubscribe" : "Subscribe"} successfully`
        )
      );

  }
);

// controller to return subscriber list of a channel
export const getUserChannelSubscribers = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { subscriberId } = req.params;
 
    
    if (!isValidObjectId(subscriberId)) {
      return res.json(new ApiError(400, "Invalid channel id"));
    }
    const channel = await User.findById(subscriberId);
    if (!channel) {
      throw new ApiError(404, "Channel not find!");
    }
    const subscribers = await Subscriber.find({ channel: subscriberId });
    return res.json(new ApiResponse(200, subscribers));
  }
);

// controller to return channel list to which user has subscribed
export const getSubscribedChannels = asyncHandler(
  async (req: UserRequest, res: Response) => {
    const { channelId } = req.params;
    console.log(req.params, "channel id");
    if (!isValidObjectId(channelId)) {
      return res.json(new ApiError(400, "Invalid subscriber id"));
    }
    const subscriber = await User.findById(channelId);
    if (!subscriber) {
      throw new ApiError(404, "Subscriber not find!");
    }
    const channels = await Subscriber.find({ subscriber: channelId });
    return res.json(new ApiResponse(200, channels));

  }
);
