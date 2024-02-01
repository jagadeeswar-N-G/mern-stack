import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { User } from "../models/userModel.ts";
import { uploadOnCloudinary } from "../utils/cloudinary.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import path from "path";


interface UploadedFiles {
  avatar?: Express.Multer.File[];
  coverImage?: Express.Multer.File[];
}
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    // get user details from frontend
    // validation
    // check if already exist-username and email
    // check for the images, check for avatar
    // upload them to cloudinary
    // create user object
    // remove password and refresh toekn field from responce
    // check for the user creation
    // return res
    const { username, email, fullName, password } = req.body;
    if (
      [username, email, fullName, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All field are required");
    }

    const userAlreadyExit = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userAlreadyExit) {
      throw new ApiError(409, "User with email or username is already exist");
    }
    console.log(req.files)
   const uploadedFiles = req.files as any;
   const avatarLocalPath = uploadedFiles.avatar[0]?.path;
   const coverLocalPath = uploadedFiles.coverImage[0]?.path;
   const normalizedPath = avatarLocalPath.replace(/\\/g, "/");
   console.log(normalizedPath);
  


    if (!normalizedPath) {
      throw new ApiError(400, "avatar is required");
    }

    const avatar = await uploadOnCloudinary(normalizedPath);
    const coverImage = await uploadOnCloudinary(coverLocalPath!);

    // if (!avatar) {
    //   throw new ApiError(400, "avatar is required");
    // }

    const user = await User.create({
      fullName,
      avatar: avatar?.url,
      converImage: coverImage?.url || "",
      email,
      password,
      username: username?.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "something went wrong we creating the user");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User successfully registered"));
  }
);
