import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth";
import { AppError } from "../../lib/errors";
import {
  createVendorService,
  deleteVendorService,
  listVendorServices,
  updateVendorService,
} from "./service.service";

export async function listVendorServicesHandler(req: AuthenticatedRequest, res: Response) {
  const vendorId = req.auth?.vendorId;
  if (!vendorId) throw new AppError("Unauthorized", 401);

  const services = await listVendorServices(vendorId);
  res.status(200).json(services);
}

export async function createVendorServiceHandler(req: AuthenticatedRequest, res: Response) {
  const vendorId = req.auth?.vendorId;
  if (!vendorId) throw new AppError("Unauthorized", 401);

  const service = await createVendorService(vendorId, req.body);
  res.status(201).json(service);
}

export async function updateVendorServiceHandler(req: AuthenticatedRequest, res: Response) {
  const vendorId = req.auth?.vendorId;
  if (!vendorId) throw new AppError("Unauthorized", 401);

  const service = await updateVendorService(vendorId, req.params.serviceId, req.body);
  res.status(200).json(service);
}

export async function deleteVendorServiceHandler(req: AuthenticatedRequest, res: Response) {
  const vendorId = req.auth?.vendorId;
  if (!vendorId) throw new AppError("Unauthorized", 401);

  const result = await deleteVendorService(vendorId, req.params.serviceId);
  res.status(200).json(result);
}

