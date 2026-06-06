import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type AuthPayload = {
  vendorId: string;
  phone: string;
};

export function signVendorToken(payload: AuthPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyVendorToken(token: string): AuthPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
}

