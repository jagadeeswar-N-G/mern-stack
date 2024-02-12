import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { User } from "../models/userModel.ts";
import { uploadOnCloudinary } from "../utils/cloudinary.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  //TODO: create playlist
});

const getUserPlaylists = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  //TODO: get user playlists
});

const getPlaylistById = asyncHandler(async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
});

const addVideoToPlaylist = asyncHandler(async (req: Request, res: Response) => {
  const { playlistId, videoId } = req.params;
});

const removeVideoFromPlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist
  }
);

const deletePlaylist = asyncHandler(async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
});
