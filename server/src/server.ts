import http from "http"
import app from "./app.js"
import { env } from "./config/env.js"
import prisma from "./lib/prisma.js"
import logger from "./utils/logger.js"
import { initializeSocket } from "./socket/index.js"

const PORT = env.PORT

async function startServer() {
  try {
    await prisma.$connect()

    logger.info("Database connected")

    const server = http.createServer(app)

    initializeSocket(server)

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
  } catch (error) {
    logger.error("Error starting server:", error)

    process.exit(1)
  }
}

startServer()
