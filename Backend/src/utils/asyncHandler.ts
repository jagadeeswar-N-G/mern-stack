import { NextFunction, Request, Response } from "express";

export const asyncHandler = (requestHandler: Function) => {
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      next(err);
    });
  };
}

