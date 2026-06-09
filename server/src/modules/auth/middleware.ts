import { Request, Response, NextFunction } from "express"
import logger from "../../utils/logger.js"

import jwt from "jsonwebtoken"

import { JwtPayload } from "../../modules/auth/validator.js"

import { env } from "../../config/env.js"
import redis from "../../lib/redis.js"
import prisma from "../../lib/prisma.js"

import ApiError from "../../utils/apiError.js"
import asyncHandler from "../../utils/asyncHandler.js"
import { redisKeys } from "../../modules/auth/utils.js"
import { StatusCodes } from "http-status-codes"

//jwt

export interface AuthRequest extends Request {
  user?: JwtPayload
}

export const authMiddleware = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Authorization token missing or invalid"
      )
    }

    const token = authHeader.split(" ")[1]

    let decoded: JwtPayload

    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    } catch (error) {
      logger.warn("JWT verification failed", {
        error: error instanceof Error ? error.message : "Unknown error",
      })

      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Access token expired")
      }

      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token")
    }

    // Check blacklist
    const isBlacklisted = await redis.get(redisKeys.blacklist(decoded.jti))

    if (isBlacklisted) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token revoked")
    }

    // Ensure user still exists
    const userExists = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
      },
    })

    if (!userExists) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "User no longer exists")
    }

    req.user = decoded

    next()
  }
)
