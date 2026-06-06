import { z } from "zod";

export const otpRequestSchema = z.object({
  phone: z.string().regex(/^[0-9]{10,15}$/),
});

export const otpVerifySchema = z.object({
  phone: z.string().regex(/^[0-9]{10,15}$/),
  code: z.string().length(6),
});

export const vendorProfileSchema = z.object({
  businessName: z.string().min(2),
  ownerName: z.string().min(2),
  mobileNumber: z.string().regex(/^[0-9]{10,15}$/),
  email: z.string().email().optional(),
  address: z.string().min(5),
  city: z.string().min(2),
  area: z.string().min(2),
  mapLocationUrl: z.string().url().optional(),
  businessImages: z.array(z.string().url()).default([]),
});

export const serviceSchema = z.object({
  category: z.string().min(2),
  serviceName: z.string().min(2),
  description: z.string().min(10),
  price: z.number().nonnegative(),
  capacity: z.number().int().nonnegative().optional(),
  galleryImages: z.array(z.string().url()).default([]),
  videoUrls: z.array(z.string().url()).default([]),
  highlights: z.array(z.string()).default([]),
});

export const offerSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  discountPercent: z.number().int().min(1).max(100),
  startDate: z.string(),
  endDate: z.string(),
});

export type VendorProfileInput = z.infer<typeof vendorProfileSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type OfferInput = z.infer<typeof offerSchema>;

