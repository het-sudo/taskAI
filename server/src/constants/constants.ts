import { StatusCodes } from "http-status-codes"

//constants to use all over system
export const AUTH_CONSTANTS = {
  //token expiry time
  ACCESS_TOKEN_EXPIRY: 15 * 60,
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000,
  PASSWORD_SALT_ROUNDS: 10,
}

//Default cookie setting
export const COOKIE_CONSTANTS = {
  REFRESH_TOKEN_NAME: "refreshToken",
  OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax" as const,
  },
}
