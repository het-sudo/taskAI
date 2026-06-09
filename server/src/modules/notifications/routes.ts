import { Router } from "express"

import { getNotifications, markNotificationRead } from "./controller.js"

import { authMiddleware } from "../auth/middleware.js"

import { validate } from "../../middleware/validate.middleware.js"

import { notificationIdSchema } from "./validator.js"

import { IRoute } from "../../routes/route.interface.js"

const router = Router()

router.get("/", authMiddleware, getNotifications)

router.patch(
  "/:id/read",
  authMiddleware,
  validate({
    params: notificationIdSchema,
  }),
  markNotificationRead
)

export const notificationRoute: IRoute = {
  path: "/notifications",
  router: router,
}
