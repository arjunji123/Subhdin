import { otpRequestSchema, otpVerifySchema } from "@shaadihub/shared";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../lib/errors";
import { signVendorToken } from "../../lib/jwt";

const OTP_EXPIRY_MINUTES = 10;

function generateOtpCode() {
  return "123456";
}

export async function requestOtp(input: unknown) {
  const payload = otpRequestSchema.parse(input);
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  const vendor = await prisma.vendor.upsert({
    where: { phone: payload.phone },
    update: {},
    create: { phone: payload.phone },
  });

  const otp = await prisma.otpSession.create({
    data: {
      phone: payload.phone,
      code,
      expiresAt,
      vendorId: vendor.id,
    },
  });

  return {
    message: "OTP sent successfully",
    otpSessionId: otp.id,
    debugCode: code,
  };
}

export async function verifyOtp(input: unknown) {
  const payload = otpVerifySchema.parse(input);

  const otp = await prisma.otpSession.findFirst({
    where: {
      phone: payload.phone,
      verified: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    throw new AppError("OTP session not found", 404);
  }

  if (otp.expiresAt < new Date()) {
    throw new AppError("OTP expired", 400);
  }

  if (otp.code !== payload.code) {
    throw new AppError("Invalid OTP", 400);
  }

  const vendor = await prisma.vendor.update({
    where: { phone: payload.phone },
    data: { isPhoneVerified: true },
  });

  await prisma.otpSession.update({ where: { id: otp.id }, data: { verified: true } });

  const token = signVendorToken({
    vendorId: vendor.id,
    phone: vendor.phone,
  });

  return {
    message: "Login successful",
    token,
    vendor,
  };
}


