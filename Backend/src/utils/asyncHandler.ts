import { NextFunction, Request } from "express"
 interface requestHandlerPropsT {
   req: Request;
   res: Response;
   next: NextFunction;
 }
const asyncHandler = (requestHandler: Function) => {
  ({ req, res, next }: requestHandlerPropsT) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      next(err);
    });
  };
}

export default asyncHandler