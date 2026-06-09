import { Server as HttpServer } from "http"
import { Server } from "socket.io"

import { socketAuthMiddleware } from "./middleware.js"
import { AuthenticatedSocket } from "./types.js"
import logger from "../utils/logger.js"

let io: Server

export function initializeSocket(httpServer: HttpServer) {
  // create socket.io server instance with CORS config
  io = new Server(httpServer, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
  })

  // apply authentication middleware for all socket connections
  io.use(socketAuthMiddleware)

  io.on("connection", (socket: AuthenticatedSocket) => {
    logger.info(`SOCKET CONNECTED: ${socket.userId}`)
    logger.info(`SOCKET ID: ${socket.id}`)

    // create user-specific room for private events
    const room = `user:${socket.userId}`

    socket.join(room)
    logger.info(`JOINED ROOM: ${room}`)

    // debug logs for tracking socket rooms and state
    logger.info(`ROOMS FOR SOCKET: ${JSON.stringify(Array.from(socket.rooms))}`)
    logger.info(
      `ACTIVE ROOMS SNAPSHOT: ${JSON.stringify(
        Array.from(io.sockets.adapter.rooms.entries())
      )}`
    )

    logger.info(`Socket connected: ${socket.userId}`)

    socket.on("disconnect", (reason) => {
      logger.info(`DISCONNECTED: ${socket.userId}`)
      logger.info(`REASON: ${reason}`)
    })
  })

  return io
}

// getter to safely access io instance anywhere in app
export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized")
  }

  return io
}
