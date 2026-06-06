import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors";
import { verifyVendorToken } from "../lib/jwt";

export type AuthenticatedRequest = Request & {
  auth?: {
    vendorId: string;
    phone: string;
  };
};

export function requireVendorAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const payload = verifyVendorToken(token);
  req.auth = payload;
  next();
}

