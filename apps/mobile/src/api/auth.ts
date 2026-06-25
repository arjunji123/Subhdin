import { apiRequest } from "./client";

const formatPhone = (phone: string) => {
  if (!phone) return phone;
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.startsWith("91") && cleaned.length > 10 ? `+${cleaned}` : `+91${cleaned}`;
};

export const authApi = {
  // Initiates OTP (Unified for both login/signup)
  requestOtp: (phone: string) =>
    apiRequest<{ debugCode: string }>("/auth/request-otp", {
      method: "POST",
      body: { phone: formatPhone(phone) },
    }),

  // Verifies OTP and optionally creates/updates profile
  verifyOtp: (phone: string, otp: string, role?: 'user' | 'vendor', profileData: any = {}) => {
    const body: any = {
      phone: formatPhone(phone),
      code: otp,
      ...profileData,
    };

    if (role) {
      body.role = role;
    }

    // Ensure mobileNumber in profileData is also formatted if present
    if (body.mobileNumber) {
      body.mobileNumber = formatPhone(body.mobileNumber);
    }

    return apiRequest<{ token: string; user: any }>("/auth/verify-otp", {
      method: "POST",
      body,
    });
  },
};
