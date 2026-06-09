import { Notification } from "@prisma/client"
import { getIO } from "./index.js"
import logger from "../utils/logger.js"

// emit notification event to specific user's socket room
export function emitNotification(userId: string, notification: Notification) {
  try {
    const io = getIO()

    // log target room for debugging socket flow
    logger.info(`EMITTING TO ROOM: user:${userId}`)

    // log full notification payload for traceability
    logger.info(
      `NOTIFICATION PAYLOAD: ${JSON.stringify(notification, null, 2)}`
    )

    // emit real-time notification event
    io.to(`user:${userId}`).emit("notification:new", notification)

    logger.info(`EMIT DONE FOR USER: ${userId}`)
  } catch (err) {
    // handle socket emit failures gracefully
    logger.error(
      `Socket emit failed: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

// emit task shared event to specific user
export function emitTaskShared(userId: string, payload: object) {
  try {
    const io = getIO()

    // log target room for debugging
    logger.info(`TASK SHARED EMIT TO ROOM: user:${userId}`)

    // log payload being sent
    logger.info(`TASK SHARED PAYLOAD: ${JSON.stringify(payload, null, 2)}`)

    // emit task shared event
    io.to(`user:${userId}`).emit("task:shared", payload)

    logger.info(`TASK SHARED EMIT DONE FOR USER: ${userId}`)
  } catch (err) {
    // handle emit failure safely
    logger.error(
      `Socket task shared emit failed: ${
        err instanceof Error ? err.message : String(err)
      }`
    )
  }
}
