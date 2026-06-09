import { StatusCodes } from "http-status-codes";
import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import ApiError from "../../utils/apiError.js";
import logger from "../../utils/logger.js";
import { getNotificationsService, markNotificationReadService, } from "./service.js";
export const getNotifications = asyncHandler(async (req, res) => {
    logger.info("get notifications request received", {
        userId: req.user?.userId,
    });
    const notifications = await getNotificationsService(req.user.userId);
    return sendResponse(res, StatusCodes.OK, "Notifications fetched successfully", notifications);
});
export const markNotificationRead = asyncHandler(async (req, res) => {
    const { id } = req.validated.params;
    logger.info("mark notification read request received", {
        notificationId: id,
        userId: req.user?.userId,
    });
    const notification = await markNotificationReadService(req.user.userId, id);
    if (!notification) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Notification not found");
    }
    return sendResponse(res, StatusCodes.OK, "Notification marked as read", notification);
});
