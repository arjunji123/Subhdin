import { apiRequest } from "./client";

const formatPhone = (phone: string) => {
  if (!phone) return phone;
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.startsWith("91") && cleaned.length > 10 ? `+${cleaned}` : `+91${cleaned}`;
};

export const vendorApi = {
  getDashboard: (token: string) =>
    apiRequest<any>("/vendor/dashboard", { token }),

  getProfile: (token: string) =>
    apiRequest<any>("/vendor/me", { token }),

  updateProfile: (token: string, data: any) => {
    const formattedData = { ...data };
    if (formattedData.mobileNumber) {
      formattedData.mobileNumber = formatPhone(formattedData.mobileNumber);
    }
    return apiRequest("/vendor/me", {
      method: "PUT",
      token,
      body: formattedData,
    });
  },

  deleteAccount: (token: string) =>
    apiRequest("/vendor/me", {
      method: "DELETE",
      token,
    }),

  // Services
  getServices: (token: string) =>
    apiRequest<any[]>("/vendor/services", { token }),

  createService: (token: string, data: any) =>
    apiRequest("/vendor/services", {
      method: "POST",
      token,
      body: data,
    }),

  updateService: (token: string, id: string, data: any) =>
    apiRequest(`/vendor/services/${id}`, {
      method: "PATCH",
      token,
      body: data,
    }),

  deleteService: (token: string, id: string) =>
    apiRequest(`/vendor/services/${id}`, {
      method: "DELETE",
      token,
    }),

  // Offers
  getOffers: (token: string) =>
    apiRequest<any[]>("/vendor/offers", { token }),

  createOffer: (token: string, data: any) =>
    apiRequest("/vendor/offers", {
      method: "POST",
      token,
      body: data,
    }),

  updateOffer: (token: string, id: string, data: any) =>
    apiRequest(`/vendor/offers/${id}`, {
      method: "PATCH",
      token,
      body: data,
    }),

  deleteOffer: (token: string, id: string) =>
    apiRequest(`/vendor/offers/${id}`, {
      method: "DELETE",
      token,
    }),

  // Uploads
  getUploadSignature: (token: string) =>
    apiRequest<{
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
      folder: string;
      publicId: string;
    }>("/uploads/signature", { token }),

  // Analytics
  trackEvent: (token: string, vendorId: string, type: 'VIEW' | 'CONTACT_REVEAL' | 'WHATSAPP_CLICK' | 'LEAD', metadata: any = {}) =>
    apiRequest("/analytics/events", {
      method: "POST",
      token,
      body: { vendorId, type, source: 'mobile', metadata }
    }),

  // Customer Side APIs
  getCustomerHome: (token: string, city: string) =>
    apiRequest<any>(`/customer/home?city=${city}`, { token }),

  getVendors: (token: string, params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest<any[]>(`/vendors?${query}`, { token });
  },

  getVendorDetail: (token: string, id: string) =>
    apiRequest<any>(`/vendors/${id}`, { token }),

  getVendorServices: (token: string, vendorId: string) =>
    apiRequest<any[]>(`/vendors/${vendorId}/services`, { token }),

  submitReview: (token: string, vendorId: string, data: { rating: number; comment: string; userName: string }) =>
    apiRequest("/vendor/reviews", {
      method: "POST",
      token,
      body: { ...data, vendorId } // Vendor review endpoint usually needs vendorId in body if not in URL
    }),
};
