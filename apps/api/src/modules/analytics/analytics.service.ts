import { EventType } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export async function trackVendorEvent(vendorId: string, type: EventType, source?: string) {
  return prisma.analyticsEvent.create({
    data: {
      vendorId,
      type,
      source,
    },
  });
}

export async function getVendorDashboard(vendorId: string) {
  const [totalServices, totalOffers, totalViews, totalContactReveals, totalWhatsappClicks, totalLeads] =
    await Promise.all([
      prisma.service.count({ where: { vendorId } }),
      prisma.offer.count({ where: { vendorId } }),
      prisma.analyticsEvent.count({ where: { vendorId, type: "VIEW" } }),
      prisma.analyticsEvent.count({ where: { vendorId, type: "CONTACT_REVEAL" } }),
      prisma.analyticsEvent.count({ where: { vendorId, type: "WHATSAPP_CLICK" } }),
      prisma.analyticsEvent.count({ where: { vendorId, type: "LEAD" } }),
    ]);

  const activeOffers = await prisma.offer.count({
    where: {
      vendorId,
      isActive: true,
      endDate: { gte: new Date() },
    },
  });

  return {
    totalServices,
    totalOffers,
    activeOffers,
    totalViews,
    totalContactReveals,
    totalWhatsappClicks,
    totalLeads,
  };
}

