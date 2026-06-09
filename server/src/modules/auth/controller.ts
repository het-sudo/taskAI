import { AUTH_CONSTANTS, COOKIE_CONSTANTS } from "../../constants/constants.js"
import { StatusCodes, ReasonPhrases } from "http-status-codes"
import asyncHandler from "../../utils/asyncHandler.js"

import logger from "../../utils/logger.js"
import sendResponse from "../../utils/sendResponse.js"
import {
  loginUser,
  logoutUser,
  refreshTokenService,
  registerUser,
} from "./service.js"
import { env } from "../../config/env.js"
import { JwtPayload, LoginInput, RegisterInput } from "./validator.js"
import jwt from "jsonwebtoken"
import ApiError from "../../utils/apiError.js"
import prisma from "../../lib/prisma.js"
import { Response } from "express"
import { AuthRequest } from "./middleware.js"

export const register = asyncHandler(async (req, res) => {
  logger.info("register request received", { email: req.body?.email })

  // create a new user in database using request body data
  const user = await registerUser(req.validated.body as RegisterInput)

  // log successful user creation for monitoring/debugging
  logger.info("user created sucessfully", { userId: user.id })

  // send success response with created user data
  return sendResponse(
    res,
    StatusCodes.CREATED,
    "User created successfully",
    user
  )
})

export const login = asyncHandler(async (req, res) => {
  logger.info("login request received", { email: req.body?.email })

  // validate credentials and generate access + refresh tokens
  const { user, accessToken, refreshToken } = await loginUser(
    req.validated.body as LoginInput
  )

  logger.info("user logged IN sucessfully", { userId: user.id })

  // prepare safe user data (excluding sensitive fields)
  const userData = { id: user.id, name: user.name, email: user.email }

  // store refresh token in httpOnly cookie for secure persistent session
  res.cookie("refreshToken", refreshToken, {
    httpOnly: COOKIE_CONSTANTS.OPTIONS.httpOnly,
    secure: COOKIE_CONSTANTS.OPTIONS.secure,
    maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY,
    sameSite: COOKIE_CONSTANTS.OPTIONS.sameSite,
    // path: COOKIE_CONSTANTS.OPTIONS.path,
  })

  logger.info("Refresh token stored in cookie", { userId: user.id })

  // return access token for frontend API authentication
  return sendResponse(res, StatusCodes.OK, "Login successful", {
    user: userData,
    auth: {
      accessToken,
    },
  })
})

export const logout = asyncHandler(async (req, res) => {
  logger.info("logout request received")

  // extract bearer token from authorization header
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    logger.warn("logout failed: access token missing")
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Access token required")
  }

  // decode JWT to get user/session expiry info
  const decoded = jwt.verify(token!, env.JWT_SECRET!) as JwtPayload & {
    exp: number
  }

  logger.info("token decoded for logout", { userId: decoded.userId })

  // invalidate session/token on server side (blacklist or DB cleanup)
  await logoutUser(decoded, decoded.exp)

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: COOKIE_CONSTANTS.OPTIONS.secure,
    sameSite: COOKIE_CONSTANTS.OPTIONS.sameSite,
    // path: COOKIE_CONSTANTS.OPTIONS.path,
  })

  logger.info("user logged out successfully", { userId: decoded.userId })

  // return logout confirmation response
  return sendResponse(res, StatusCodes.OK, "Logged out successfully")
})

export const refreshToken = asyncHandler(async (req, res) => {
  logger.info("refresh token request received")

  // get refresh token from cookie
  const refreshToken = req.cookies.refreshToken

  // if no refresh token exists, deny access
  if (!refreshToken) {
    logger.warn("No refresh token exist")
    return sendResponse(res, StatusCodes.UNAUTHORIZED, "Refresh token missing")
  }

  logger.info("refresh token found, processing rotation")

  // validate refresh token and generate new access token (and possibly new refresh token)
  const result = await refreshTokenService(refreshToken)

  // update refresh token in cookie (token rotation for better security)
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: COOKIE_CONSTANTS.OPTIONS.httpOnly,
    secure: COOKIE_CONSTANTS.OPTIONS.secure,
    sameSite: COOKIE_CONSTANTS.OPTIONS.sameSite,
    maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY,
  })

  logger.info("user token refreshed successfully", {
    userId: result.user?.id,
  })

  // return new access token and user data to keep session active
  return sendResponse(res, StatusCodes.OK, "Token refreshed successfully", {
    auth: {
      accessToken: result.accessToken,
    },
    user: result.user,
  })
})

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  logger.info("getMe request received", { userId: req.user?.userId })

  const user = await prisma.user.findUnique({
    where: {
      id: req.user?.userId,
    },

    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  if (!user) {
    logger.warn("getMe failed: user not found", { userId: req.user?.userId })
    throw new ApiError(StatusCodes.NOT_FOUND, "user not found")
  }

  logger.info("user fetched successfully", { userId: user.id })

  return sendResponse(res, StatusCodes.OK, "user fetched successfully", user)
})
