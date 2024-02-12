import { Video } from "../models/videoModel";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { uploadOnCloudinary } from "../utils/cloudinary";

interface userRequest extends Request {
  user?: any;
}

export const getAllVideos = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
  }
);

export const publishAVideo = asyncHandler(
  async (req: userRequest, res: Response) => {
    const { title, description } = req.body;
    // TODO: get video, upload to cloudinary, create video
    // TODO: save video to database
    // TODO: return response
    if (!title || title?.trim() === "") {
      throw res.json(new ApiError(400, "Title content is required"));
    }
    if (!description || description?.trim() === "") {
      throw res.json(new ApiError(400, "description content is required"));
    }

    const uploadedFiles = req.files as any;
    const videoLocalPath = uploadedFiles.videoFile[0]?.path;
    const thumbnailLocalPath = uploadedFiles.thumbnail[0]?.path;
    const normalizedPathVideo = videoLocalPath.replace(/\\/g, "/");
    const normalizedPathThumbnail = thumbnailLocalPath.replace(/\\/g, "/");

    if (!normalizedPathVideo || !normalizedPathThumbnail) {
      throw res.json(new ApiError(400, "video file and thimbnail is required"));
    }

    const video = await uploadOnCloudinary(normalizedPathVideo);
    const thumbnail = await uploadOnCloudinary(normalizedPathThumbnail!);

    const videoData = {
      title,
      description,
      ownerId: req.user._id,
      video: video?.url,
      thumbnail: thumbnail?.url,
      published: true,
      duration: video?.duration,
    };

    const newVideo = await Video.create(videoData);
    return res.status(201).json(new ApiResponse(201, newVideo));
  }
);

export const getVideoById = asyncHandler(
  async (req: Request, res: Response) => {
    const { videoId } = req.params;
    //TODO: get video by id
  }
);

export const updateVideo = asyncHandler(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  //TODO: delete video
});

export const togglePublishStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { videoId } = req.params;
  }
);
