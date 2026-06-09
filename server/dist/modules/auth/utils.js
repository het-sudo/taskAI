import bcrypt from "bcrypt";
import { env } from "../../config/env.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AUTH_CONSTANTS } from "../../constants/constants.js";
export const hashPassword = async (password) => {
    return bcrypt.hash(password, AUTH_CONSTANTS.PASSWORD_SALT_ROUNDS);
};
export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY,
    });
};
export const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};
export const generateJti = () => {
    return crypto.randomUUID();
};
export const redisKeys = {
    blacklist: (jti) => `auth:bl:${jti}`,
};
export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};
