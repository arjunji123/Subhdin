import { offerSchema } from "@shaadihub/shared";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/errors";

export async function listVendorOffers(vendorId: string) {
  return prisma.offer.findMany({
    where: { vendorId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createVendorOffer(vendorId: string, input: unknown) {
  const payload = offerSchema.parse(input);

  return prisma.offer.create({
    data: {
      vendorId,
      title: payload.title,
      description: payload.description,
      discountPercent: payload.discountPercent,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      isActive: true,
    },
  });
}

export async function updateVendorOffer(vendorId: string, offerId: string, input: unknown) {
  const payload = offerSchema.partial().parse(input);

  const existing = await prisma.offer.findFirst({
    where: { id: offerId, vendorId },
  });

  if (!existing) throw new AppError("Offer not found", 404);

  return prisma.offer.update({
    where: { id: offerId },
    data: {
      title: payload.title,
      description: payload.description,
      discountPercent: payload.discountPercent,
      startDate: payload.startDate ? new Date(payload.startDate) : undefined,
      endDate: payload.endDate ? new Date(payload.endDate) : undefined,
    },
  });
}

export async function deleteVendorOffer(vendorId: string, offerId: string) {
  const existing = await prisma.offer.findFirst({
    where: { id: offerId, vendorId },
  });

  if (!existing) throw new AppError("Offer not found", 404);

  await prisma.offer.delete({ where: { id: offerId } });
  return { message: "Offer deleted" };
}


