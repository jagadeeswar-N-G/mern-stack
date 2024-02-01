import { Request, Response } from "express";
import {asyncHandler} from "../utils/asyncHandler.ts";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    message: "user registered",
  });
  return null;
});
