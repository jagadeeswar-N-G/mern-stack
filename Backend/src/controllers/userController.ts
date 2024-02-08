import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/apiError.ts";
import { User } from "../models/userModel.ts";
import { uploadOnCloudinary } from "../utils/cloudinary.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

interface userRequest extends Request {
  user?: any;
}
const generateAccessAndRefreshToken = async (userId: unknown) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating the tokens");
  }
};

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
    const uploadedFiles = req.files as any;
    const avatarLocalPath = uploadedFiles.avatar[0]?.path;
    const coverLocalPath = uploadedFiles.coverImage[0]?.path;
    const normalizedPathAvatar = avatarLocalPath.replace(/\\/g, "/");
    const normalizedPathCover = coverLocalPath.replace(/\\/g, "/");

    if (!normalizedPathAvatar) {
      throw new ApiError(400, "avatar is required");
    }

    const avatar = await uploadOnCloudinary(normalizedPathAvatar);
    const coverImage = await uploadOnCloudinary(normalizedPathCover!);

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

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "username or password is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "user does not exit");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalide Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true, // onlly server can access this cookies
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(
  async (req: userRequest, res: Response) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true, // onlly server can access this cookies
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "user successfully logged out" });
  }
);

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as any;

      const user = await User.findById(decodedToken?._id);

      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }

      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
      }

      const options = {
        httpOnly: true,
        secure: true,
      };

      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
      );

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken: refreshToken },
            "Access token refreshed"
          )
        );
    } catch (error: any) {
      throw new ApiError(401, error?.message || "Invalid refresh token");
    }
  }
);

export const changePassword = asyncHandler(
  async (req: userRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?.id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid Password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: true });

    return res
      .status(200)
      .json(new ApiResponse(200, "password is successfully Changed"));
  }
);

export const getCurrentUser = asyncHandler(
  async (req: userRequest, res: Response) => {
    res
      .status(200)
      .json({ message: "successfully fetched the user", user: req.user });
  }
);

export const updateAccountDetails = asyncHandler(
  async (req: userRequest, res: Response) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          fullName,
          email: email,
        },
      },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Account details updated successfully"));
  }
);

export const updateUserCover = asyncHandler(
  async (req: userRequest, res: Response) => {
    const files = req.files as any;
    const coverPath = files?.path;

    if (!coverPath) {
      throw new ApiError(400, "the avatar path is not available");
    }

    const cover = (await uploadOnCloudinary(coverPath)) as any;

    const user = User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          cover: cover.url,
        },
      },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "user Cover is updated successfully"));
  }
);
export const updateUserAvatat = asyncHandler(
  async (req: userRequest, res: Response) => {
    const files = req.files as any;
    const avatarPath = files?.path;

    if (!avatarPath) {
      throw new ApiError(400, "the avatar path is not available");
    }

    const avatar = (await uploadOnCloudinary(avatarPath)) as any;

    const user = User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: avatar.url,
        },
      },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "user Avatar is updated successfully"));
  }
);

export const getUserChannelProfile = asyncHandler(
  async (req: userRequest, res: Response) => {
    const {username} = req.params;
    if(!username.trim()) {
        throw new ApiError(400, "username is required");
    }

    const channel = await User.aggregate([
      {
        $match: {
          username: username?.toLowerCase(),
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscriptions",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscriberCount: {
            $size: "$subscriptions",
          },
          subscriptionCount: {
            $size: "$subscribedTo",
          },
          isSubscribed: {
            $cond: {
              if: {
                $in: [req.user?._id, "$subscriptions.subscriber"],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          avatar: 1,
          subscriberCount: 1,
          subscriptionCount: 1,
          isSubscribed: 1,
          email: 1,
        },
      },
    ]);

    if (!channel?.length) {
       throw new ApiError(404, "channel not found");
    }

    return res.status(200).json(new ApiResponse(200, channel[0]));
  }
);

export const getUserHistory = asyncHandler(
  async (req: userRequest, res: Response) => {
    const user = await User.aggregate([
      {
        $match: {
          Id: new mongoose.Types.ObjectId(req.user?._id),
        }
      }, 
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [{
                  $project: {
                    fullName: 1,
                    avatar: 1,
                    username: 1,
                  }
                }]
              }
            },
            {
              $addFields: {
                owner: {
                  $first: "$owner",
                }
              }
            }
          ]
        }
      }
    ])

    return res.status(200).json(new ApiResponse(200, user[0].watchHistory));
  }
)