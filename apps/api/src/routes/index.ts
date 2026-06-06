import { Router } from "express";
import { requestOtpHandler, verifyOtpHandler } from "../modules/auth/auth.controller";
import { requireVendorAuth } from "../middleware/auth";
import {
  deleteVendorAccountHandler,
  getVendorProfileHandler,
  upsertVendorProfileHandler,
} from "../modules/vendor/vendor.controller";
import {
  createVendorServiceHandler,
  deleteVendorServiceHandler,
  listVendorServicesHandler,
  updateVendorServiceHandler,
} from "../modules/service/service.controller";
import {
  createVendorOfferHandler,
  deleteVendorOfferHandler,
  listVendorOffersHandler,
  updateVendorOfferHandler,
} from "../modules/offer/offer.controller";
import { getVendorDashboardHandler, trackVendorEventHandler } from "../modules/analytics/analytics.controller";
import { getUploadSignature } from "../lib/cloudinary";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

apiRouter.post("/auth/request-otp", requestOtpHandler);
apiRouter.post("/auth/verify-otp", verifyOtpHandler);

apiRouter.get("/vendor/me", requireVendorAuth, getVendorProfileHandler);
apiRouter.put("/vendor/me", requireVendorAuth, upsertVendorProfileHandler);
apiRouter.delete("/vendor/me", requireVendorAuth, deleteVendorAccountHandler);

apiRouter.get("/vendor/services", requireVendorAuth, listVendorServicesHandler);
apiRouter.post("/vendor/services", requireVendorAuth, createVendorServiceHandler);
apiRouter.patch("/vendor/services/:serviceId", requireVendorAuth, updateVendorServiceHandler);
apiRouter.delete("/vendor/services/:serviceId", requireVendorAuth, deleteVendorServiceHandler);

apiRouter.get("/vendor/offers", requireVendorAuth, listVendorOffersHandler);
apiRouter.post("/vendor/offers", requireVendorAuth, createVendorOfferHandler);
apiRouter.patch("/vendor/offers/:offerId", requireVendorAuth, updateVendorOfferHandler);
apiRouter.delete("/vendor/offers/:offerId", requireVendorAuth, deleteVendorOfferHandler);

apiRouter.get("/vendor/dashboard", requireVendorAuth, getVendorDashboardHandler);
apiRouter.post("/analytics/events", trackVendorEventHandler);

apiRouter.get("/uploads/signature", requireVendorAuth, (_req, res) => {
  const signedPayload = getUploadSignature("shaadihub/vendors");
  res.status(200).json(signedPayload);
});

