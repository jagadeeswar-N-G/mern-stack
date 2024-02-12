import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { Comment } from "../models/commentModel.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import mongoose, { isValidObjectId } from "mongoose";

interface userRequest extends Request {
  user?: any;
}

export const getVideoComments = asyncHandler(
  async (req: Request, res: Response) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query as any;
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }

    const comments = await Comment.find({ videoId: videoId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Comment.countDocuments({ videoId: videoId });
    return res.json({
      comments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  }
);

export const addComment = asyncHandler(
  async (req: userRequest, res: Response) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body as any;
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }
    if (!content || content?.trim() === "") {
      throw new ApiError(400, "Content is required");
    }
    const comment = await Comment.create({
      content,
      videoId,
      ownerId: req.user._id,
    });
    return res.status(201).json(new ApiResponse(201, comment));
  }
);

export const updateComment = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { content } = req.body as any;
    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid comment id");
    }
    if (!content || content?.trim() === "") {
      throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { content: req.body.content },
      { new: true }
    );

    return res.json(new ApiResponse(200, comment, "updated"));
  }
);

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid comment id");
    }
    const comment = await Comment.findByIdAndDelete(commentId);
    return res.json(new ApiResponse(200, comment, "deleted"));
  }
);
