import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { Playlist } from "../models/playlistModel.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { isValidObjectId } from "mongoose";
import { Video } from "../models/videoModel.ts";
interface userRequest extends Request {
  user?: any;
}
export const createPlaylist = asyncHandler(async (req: userRequest, res: Response) => {
  const { name, description } = req.body;

  //TODO: create playlist
  const playlist = await Playlist.create({
    name,
    description,
    ownerId: req.user._id,
  });
  return res.status(201).json(new ApiResponse(201,playlist, "Playlist created successfully"));
});

export const getUserPlaylists = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  //TODO: get user playlists
  if(!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }
  const playlists = await Playlist.find({ ownerId: userId });
  return res.json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

export const getPlaylistById = asyncHandler(async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if(!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  const playlist = await Playlist.findById(playlistId);
  return res.json(new ApiResponse(200, playlist, "Playlist fetched successfully"));

});

export const addVideoToPlaylist = asyncHandler(async (req: Request, res: Response) => {
  const { playlistId, videoId } = req.params;
  //TODO: add video to playlist
  if(!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  if(!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }
  const playlist = await Playlist.findById(playlistId);
  
  if(!playlist) {
    throw new ApiError(400, "Playlist not found");
  }
  const video = await Video.findById(videoId);
  if(!video) {
    throw new ApiError(400, "Video not found");
  }
  playlist.videos.push(video);
  await playlist.save();
  return res.json(new ApiResponse(200, playlist, "Video added to playlist"));

});

export const removeVideoFromPlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist id");
    }
    if(!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }
    const playlist = await Playlist.findById(playlistId);
    if(!playlist) {
      throw new ApiError(400, "Playlist not found");
    }
    const video = await Video.findById(videoId);
    if(!video) {
        throw new ApiError(400, "Video not found");
    }
    playlist.videos.pull(video);
    await playlist.save();
    return res.json(new ApiResponse(200, playlist, "Video removed from playlist"));
  }
);

export const deletePlaylist = asyncHandler(async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if(!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  const playlist = await Playlist.findById(playlistId);
  if(!playlist) {
    throw new ApiError(400, "Playlist not found");
  }
  await playlist.remove();
  return res.json(new ApiResponse(200, playlist, "Playlist deleted"));

});

export const updatePlaylist = asyncHandler(async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  if(!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }
  const playlist = await Playlist.findById(playlistId);
  if(!playlist) {
    throw new ApiError(400, "Playlist not found");
  }
  playlist.name = name;
  playlist.description = description;
  await playlist.save();
  return res.json(new ApiResponse(200, playlist, "Playlist updated"));
});
