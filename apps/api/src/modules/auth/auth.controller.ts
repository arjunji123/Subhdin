import { Request, Response } from "express";
import { requestOtp, verifyOtp } from "./auth.service";

export async function requestOtpHandler(req: Request, res: Response) {
  const result = await requestOtp(req.body);
  res.status(200).json(result);
}

export async function verifyOtpHandler(req: Request, res: Response) {
  const result = await verifyOtp(req.body);
  res.status(200).json(result);
}

