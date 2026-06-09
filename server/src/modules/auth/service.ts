import { StatusCodes } from "http-status-codes"
import { AUTH_CONSTANTS } from "../../constants/constants.js"
import prisma from "../../lib/prisma.js"
import redis from "../../lib/redis.js"
import ApiError from "../../utils/apiError.js"
import logger from "../../utils/logger.js"
import {
  comparePassword,
  generateAccessToken,
  generateJti,
  generateRefreshToken,
  hashPassword,
  hashToken,
  redisKeys,
} from "./utils.js"
import { JwtPayload, LoginInput, RegisterInput } from "./validator.js"
import crypto from "crypto"

export const registerUser = async (payload: RegisterInput) => {
  logger.info("registerUser called", { email: payload.email })

  // extract and normalize user input data
  const { name, email, password } = payload
  const normalizedEmail = email.toLowerCase()

  // check if user already exists in database
  logger.info("checking user exist or not", { email: payload.email })
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  })

  // prevent duplicate user registration
  if (existingUser) {
    logger.error("user already exist", { email: payload.email })
    throw new ApiError(StatusCodes.BAD_REQUEST, "User already exists")
  }

  // hash password before storing in DB for security
  const hashedPassword = await hashPassword(password)

  logger.info("user password hashed sucessfully")

  // create new user record in database
  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  // log successful user creation
  logger.info("User saved in DB", { userId: user.id })

  return user
}

export const loginUser = async (payload: LoginInput) => {
  logger.info("loginUser called", { email: payload.email })

  // extract login credentials
  const { email, password } = payload
  const normalizedEmail = email.toLowerCase()

  // find user by email
  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  })

  // reject login if user not found
  if (!user) {
    logger.warn("login failed: user not found", { email: normalizedEmail })
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password")
  }

  // verify password hash match
  const isPasswordMatched = await comparePassword(password, user.password)

  // reject login if password is incorrect
  if (!isPasswordMatched) {
    logger.warn("login failed: invalid password", { email: normalizedEmail })
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password")
  }

  logger.info("credentials validated successfully", { userId: user.id })

  // generate unique session identifier (jti) for token tracking
  const jti = generateJti()

  // create signed access token for API authentication
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    jti,
  })

  // generate secure refresh token for session persistence
  const refreshToken = generateRefreshToken()

  // hash refresh token before storing in DB for security
  const hashedRefreshToken = hashToken(refreshToken)

  logger.info("revoking previous active sessions", { userId: user.id })

  await prisma.session.updateMany({
    where: {
      userId: user.id,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  })

  // store session in database for refresh token validation
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: hashedRefreshToken,
      expiresAt: new Date(Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY),
    },
  })

  // update last login timestamp for auditing/analytics
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  })

  logger.info("login successful", { userId: user.id })

  // return tokens and safe user data to client
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  }
}

export const logoutUser = async (decodedToken: JwtPayload, exp: number) => {
  logger.info("logoutUser called", {
    userId: decodedToken.userId,
    jti: decodedToken.jti,
  })

  // calculate remaining token lifetime for redis blacklist expiry
  const now = Math.floor(Date.now() / 1000)
  const ttl = exp - now

  // blacklist access token in redis until it naturally expires
  if (ttl > 0) {
    logger.info("blacklisting token in redis", {
      jti: decodedToken.jti,
      ttl,
    })

    await redis.set(redisKeys.blacklist(decodedToken.jti), "1", "EX", ttl)
  }

  // revoke all active sessions for this user in database
  logger.info("revoking all sessions for user", {
    userId: decodedToken.userId,
  })

  await prisma.session.updateMany({
    where: {
      userId: decodedToken.userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  })

  logger.info("logout completed successfully", {
    userId: decodedToken.userId,
  })
}

export const refreshTokenService = async (refreshToken: string) => {
  logger.info("refreshTokenService called")

  // Hash incoming refresh token
  const hashedToken = hashToken(refreshToken)

  // Find session INCLUDING revoked sessions
  // Needed for refresh token reuse detection
  const session = await prisma.session.findFirst({
    where: {
      refreshToken: hashedToken,
    },
    include: {
      user: true,
    },
  })

  // Token does not exist
  if (!session) {
    logger.warn("invalid refresh token attempt")
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token")
  }

  // Refresh token reuse detection
  if (session.revokedAt) {
    logger.warn("Refresh token reuse detected", {
      userId: session.userId,
      sessionId: session.id,
    })

    await prisma.session.updateMany({
      where: {
        userId: session.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    })

    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Session compromise detected. Please login again."
    )
  }

  // Check refresh token expiry
  if (session.expiresAt < new Date()) {
    logger.warn("Expired refresh token used", {
      userId: session.userId,
      sessionId: session.id,
    })

    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        revokedAt: new Date(),
      },
    })

    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token expired")
  }

  logger.info("refresh token validated successfully", {
    userId: session.userId,
  })

  // Generate new JTI for new access token
  const newJti = generateJti()

  // Generate new access token
  const accessToken = generateAccessToken({
    userId: session.userId,
    email: session.user.email,
    jti: newJti,
  })

  // Generate new refresh token (rotation)
  const newRefreshToken = generateRefreshToken()

  // Hash new refresh token before storing
  const hashedNewToken = hashToken(newRefreshToken)

  logger.info("rotating refresh token", { userId: session.userId })

  // Rotate refresh token atomically
  await prisma.$transaction(async (tx) => {
    // Revoke old session
    await tx.session.update({
      where: {
        id: session.id,
      },
      data: {
        revokedAt: new Date(),
      },
    })

    // Create new rotated session
    await tx.session.create({
      data: {
        userId: session.userId,
        refreshToken: hashedNewToken,
        expiresAt: new Date(Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY),
      },
    })
  })

  logger.info("Refresh token rotated successfully", {
    userId: session.userId,
    sessionId: session.id,
  })

  // Return new tokens + user data
  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
  }
}
