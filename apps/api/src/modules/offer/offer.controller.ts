import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth";
import { AppError } from "../../lib/errors";
import {
  createVendorOffer,
  deleteVendorOffer,
  listVendorOffers,
  updateVendorOffer,
} from "./offer.service";

export async function listVendorOffersHandler(req: AuthenticatedRequest, res: Response) {
  const vendorId = req.auth?.vendorId;
  if (!vendorId) throw new AppError("Unauthorized", 401);

  const offers = await listVendorOffers(vendorId);
  res.status(200).json(offers);
}

export async function createVendorOfferHandler(req: AuthenticatedRequest, res: Response) {
  const vendorId = req.auth?.vendorId;
  if (!vendorId) throw new AppError("Unauthorized", 401);

  const offer = await createVendorOffer(vendorId, req.body);
  res.status(201).json(offer);
}

export async function updateVendorOfferHandler(req: AuthenticatedRequest, res: Response) {
  const vendorId = req.auth?.vendorId;
  if (!vendorId) throw new AppError("Unauthorized", 401);

  const offer = await updateVendorOffer(vendorId, req.params.offerId, req.body);
  res.status(200).json(offer);
}

export async function deleteVendorOfferHandler(req: AuthenticatedRequest, res: Response) {
  const vendorId = req.auth?.vendorId;
  if (!vendorId) throw new AppError("Unauthorized", 401);

  const result = await deleteVendorOffer(vendorId, req.params.offerId);
  res.status(200).json(result);
}

