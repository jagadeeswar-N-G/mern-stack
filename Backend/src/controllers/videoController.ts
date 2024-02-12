import { Video } from "../models/videoModel";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { isValidObjectId } from "mongoose";

interface userRequest extends Request {
  user?: any;
}

export const getAllVideos = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } : any = req.query;

    const pipeline = [] as any;

    // Use $expr to optimize filtering by userId instead of separate lookup
    // pipeline.push({
    //   $match: {
    //     $expr: {
    //       $eq: ["$ownerId", new Object(userId)],
    //     },
    //   },
    // });

    // Combine filtering by text search into one $match stage
    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        },
      });
    }

    // Sort stage
    if (sortBy && sortType) {
      const sortTypeValue = sortType === "desc" ? -1 : 1;
      pipeline.push({
        $sort: { [sortBy]: sortTypeValue },
      });
    }

    // Simplify populate stage
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner",
      },
    });

    // Remove unnecessary $addFields stage

    const aggregate = Video.aggregate(pipeline);

    Video.aggregatePaginate(aggregate, { page, limit })
      .then(function (result) {
        return res
          .status(200)
          .json(
            new ApiResponse(200, { result }, "Fetched videos successfully")
          );
      })
      .catch(function (error) {
        throw error;
      });



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
    
  if (!isValidObjectId(videoId)) {
    return res.json(new ApiError(400, "Invalid video id"));
  }
    const video = await Video.findById(videoId);
    if (!video) {
      return res.json(new ApiError(404, "Video not found"));
    }
    return res.json(new ApiResponse(200, video));
  }
);

export const updateVideo = asyncHandler(async (req: Request, res: Response) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    return res.json(new ApiError(400, "Invalid video id"));
  }

  const video = await Video.findById(videoId);

  if (!video) {
    res.status(404);
    throw new Error("Video not found");
  }

  const { title, description } = req.body;

  video.title = title;
  video.description = description;

  const updatedVideo = await video.save();

  res.json(updatedVideo);
});


export const deleteVideo = asyncHandler(async (req: userRequest, res: Response) => {
  const { videoId } = req.params;
  //TODO: delete video

  if (!isValidObjectId(videoId)) {
    return res.json(new ApiError(400, "Invalid video id"));
  }

  const video = await Video.findById(videoId);
  if (!video) {
    return res.json(new ApiError(404, "Video not found"));
  }

  if (video.ownerId.toString() !== req.user._id.toString()) {
    return res.json(new ApiError(401, "Unauthorized"));
  }

  await Video.findByIdAndDelete(videoId);

  return res.json(new ApiResponse(200, {}, "Video deleted successfully"));
});

export const togglePublishStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      return res.json(new ApiError(400, "Invalid video id"));
    }
    const video = await Video.findById(videoId);
    if (!video) {
      res.status(404);
      throw new Error("Video not found");
    }
    video.published = !video.published;
    await video.save();

    return res.json(new ApiResponse(200, video, "Video status updated successfully"));
  }
);

export const updateThumbnail = asyncHandler( async (req: Request, res: Response) => 
{
  const { videoId } = req.params;
  if(!isValidObjectId(videoId)) {
    return res.json(new ApiError(400, "Invalid video id"));
  }
  const video = await Video.findById(videoId);
  if(!video) {
    res.status(404);
    throw new Error("Video not found");
  }

  const uploadedFiles = req.files as any;
  const thumbnailLocalPath = uploadedFiles?.thumbnail[0]?.path;
  const normalizedPathThumbnail = thumbnailLocalPath.replace(/\\/g, "/");
  
  if(!normalizedPathThumbnail) {
    return res.json(new ApiError(400, "thumbnail is required"));
  }
  const thumbnail = await uploadOnCloudinary(normalizedPathThumbnail!);

  video.thumbnail = thumbnail?.url;

  const updatedVideo = await video.save();
  return res.json(new ApiResponse(200, updatedVideo, "Thumbnail updated successfully"));
})

