import { vendorProfileSchema } from "@shaadihub/shared";
import { prisma } from "../../lib/prisma";

export async function getVendorProfile(vendorId: string) {
  return prisma.vendor.findUnique({
    where: { id: vendorId },
    include: {
      services: true,
      offers: true,
    },
  });
}

export async function upsertVendorProfile(vendorId: string, input: unknown) {
  const payload = vendorProfileSchema.parse(input);

  return prisma.vendor.update({
    where: { id: vendorId },
    data: {
      ...payload,
      status: "PENDING",
    },
  });
}

export async function deleteVendorAccount(vendorId: string) {
  await prisma.vendor.delete({ where: { id: vendorId } });
  return { message: "Vendor account deleted" };
}


