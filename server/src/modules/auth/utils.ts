import bcrypt from "bcrypt"
import { JwtPayload } from "./validator.js"
import { env } from "../../config/env.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { AUTH_CONSTANTS } from "../../constants/constants.js"

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, AUTH_CONSTANTS.PASSWORD_SALT_ROUNDS)
}

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword)
}

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY,
  })
}

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex")
}

export const generateJti = () => {
  return crypto.randomUUID()
}

export const redisKeys = {
  blacklist: (jti: string) => `auth:bl:${jti}`,
}

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex")
}
