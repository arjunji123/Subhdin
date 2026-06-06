import { serviceSchema } from "@shaadihub/shared";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/errors";

export async function listVendorServices(vendorId: string) {
  return prisma.service.findMany({
    where: { vendorId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createVendorService(vendorId: string, input: unknown) {
  const payload = serviceSchema.parse(input);

  return prisma.service.create({
    data: {
      vendorId,
      ...payload,
    },
  });
}

export async function updateVendorService(vendorId: string, serviceId: string, input: unknown) {
  const payload = serviceSchema.partial().parse(input);

  const service = await prisma.service.findFirst({
    where: { id: serviceId, vendorId },
  });

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  return prisma.service.update({
    where: { id: serviceId },
    data: payload,
  });
}

export async function deleteVendorService(vendorId: string, serviceId: string) {
  const service = await prisma.service.findFirst({
    where: { id: serviceId, vendorId },
  });

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  await prisma.service.delete({ where: { id: serviceId } });
  return { message: "Service deleted" };
}


