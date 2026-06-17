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
};
