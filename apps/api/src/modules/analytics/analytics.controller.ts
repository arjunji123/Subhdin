import { EventType } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../../middleware/auth";
import { AppError } from "../../lib/errors";
import { getVendorDashboard, trackVendorEvent } from "./analytics.service";

const trackEventSchema = z.object({
  vendorId: z.string().cuid(),
  type: z.nativeEnum(EventType),
  source: z.string().optional(),
});

export async function getVendorDashboardHandler(req: AuthenticatedRequest, res: Response) {
  const vendorId = req.auth?.vendorId;
  if (!vendorId) throw new AppError("Unauthorized", 401);

  const dashboard = await getVendorDashboard(vendorId);
  res.status(200).json(dashboard);
}

export async function trackVendorEventHandler(req: Request, res: Response) {
  const payload = trackEventSchema.parse(req.body);
  const event = await trackVendorEvent(payload.vendorId, payload.type, payload.source);
  res.status(201).json(event);
}

