import { Response } from "express"
import { StatusCodes } from "http-status-codes"

import asyncHandler from "../../utils/asyncHandler.js"
import sendResponse from "../../utils/sendResponse.js"
import ApiError from "../../utils/apiError.js"
import logger from "../../utils/logger.js"

import { AuthRequest } from "../auth/middleware.js"

import {
  getNotificationsService,
  markNotificationReadService,
} from "./service.js"

import { NotificationIdInput } from "./validator.js"

export const getNotifications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    logger.info("get notifications request received", {
      userId: req.user?.userId,
    })

    const notifications = await getNotificationsService(req.user!.userId)

    return sendResponse(
      res,
      StatusCodes.OK,
      "Notifications fetched successfully",
      notifications
    )
  }
)

export const markNotificationRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.validated.params as NotificationIdInput

    logger.info("mark notification read request received", {
      notificationId: id,
      userId: req.user?.userId,
    })

    const notification = await markNotificationReadService(req.user!.userId, id)

    if (!notification) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Notification not found")
    }

    return sendResponse(
      res,
      StatusCodes.OK,
      "Notification marked as read",
      notification
    )
  }
)
