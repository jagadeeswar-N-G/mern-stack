import { Request } from "express"
export const DB_NAME="JagadeeswarDB"
export interface UserRequest extends Request {
  user: {
    _id: string;
  };
}