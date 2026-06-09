import jwt from "jsonwebtoken"

import { env } from "../config/env.js"
import { JwtPayload } from "../modules/auth/validator.js"
import { AuthenticatedSocket } from "./types.js"
import logger from "../utils/logger.js"

export function socketAuthMiddleware(
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) {
  try {
    // token sent from client during socket connection handshake
    const token = socket.handshake.auth.token

    // reject connection if token is missing
    if (!token) {
      return next(new Error("Unauthorized"))
    }

    // verify jwt token and extract payload
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload

    logger.info(`SOCKET TOKEN RECEIVED: ${!!token}`)

    logger.info(`DECODED USER: ${decoded.userId}`)

    // attach userId to socket for later use in events
    socket.userId = decoded.userId

    // allow socket connection
    next()
  } catch (err) {
    // log and reject socket connection if auth fails
    logger.info(`SOCKET AUTH FAILED: ${String(err)}`)

    next(new Error("Unauthorized"))
  }
}
