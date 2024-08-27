import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { isURL } from "validator";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateUrl(value: string) {
  return isURL(value);
}

export function generateAccessToken(
  id: mongoose.Types.ObjectId,
  email: string,
) {
  const payload = {
    sub: id,
    email,
  };

  const secret = process.env.SECRET_KEY || "super-secret-key";
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  return token;
}

export function generateRefreshToken(
  id: mongoose.Types.ObjectId,
  email: string,
) {
  const payload = {
    sub: id,
    email,
  };

  const secret = process.env.SECRET_KEY || "super-secret-key";
  const token = jwt.sign(payload, secret, { expiresIn: "7d" });
  return token;
}

export function verifyToken(token: string) {
  const secret = process.env.SECRET_KEY || "super-secret-key";
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return null;
  }
}
