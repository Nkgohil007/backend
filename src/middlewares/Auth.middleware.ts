import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "@utils";
import jwt from "jsonwebtoken";
import { IUser, JwtDecodeToken, User } from "@models";
import * as process from "process";
import { Request, Response, NextFunction } from "express";

export interface verifyJWTRequest extends Request {
  user: IUser;
}

export const verifyJWT = asyncHandler(
  async (req: verifyJWTRequest, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }

      const decodeToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET ?? ""
      ) as JwtDecodeToken;

      const user = await User.findById(decodeToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }

      req.user = user;
      next();
    } catch (error: any) {
      throw new ApiError(401, error?.message || "Invalid access token");
    }
  }
);
