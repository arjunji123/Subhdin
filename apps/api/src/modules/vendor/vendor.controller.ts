import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth";
import { AppError } from "../../lib/errors";
import { deleteVendorAccount, getVendorProfile, upsertVendorProfile } from "./vendor.service";

export async function getVendorProfileHandler(req: AuthenticatedRequest, res: Response) {
  const vendorId = req.auth?.vendorId;
  if (!vendorId) throw new AppError("Unauthorized", 401);

  const vendor = await getVendorProfile(vendorId);
  res.status(200).json(vendor);
}

export async function upsertVendorProfileHandler(req: AuthenticatedRequest, res: Response) {
  const vendorId = req.auth?.vendorId;
  if (!vendorId) throw new AppError("Unauthorized", 401);

  const vendor = await upsertVendorProfile(vendorId, req.body);
  res.status(200).json(vendor);
}

export async function deleteVendorAccountHandler(req: AuthenticatedRequest, res: Response) {
  const vendorId = req.auth?.vendorId;
  if (!vendorId) throw new AppError("Unauthorized", 401);

  const result = await deleteVendorAccount(vendorId);
  res.status(200).json(result);
}

