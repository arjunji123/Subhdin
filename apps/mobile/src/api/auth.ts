import { apiRequest } from "./client";

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.startsWith("91") && cleaned.length > 10 ? `+${cleaned}` : `+91${cleaned}`;
};

export const authApi = {
  requestOtp: (phone: string) =>
    apiRequest<{ debugCode: string }>("/auth/request-otp", {
      method: "POST",
      body: { phone: formatPhone(phone) },
    }),

  loginRequestOtp: (phone: string) =>
    apiRequest<{ debugCode: string }>("/auth/login-request-otp", {
      method: "POST",
      body: { phone: formatPhone(phone) },
    }),

  verifyOtp: (phone: string, otp: string) =>
    apiRequest<{ token: string }>("/auth/verify-otp", {
      method: "POST",
      body: { phone: formatPhone(phone), code: otp },
    }),
};
