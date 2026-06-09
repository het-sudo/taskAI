import asyncHandler from "../../utils/asyncHandler.js";
import sendResponse from "../../utils/sendResponse.js";
import { getDashboardStatsService } from "./service.js";
export const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const data = await getDashboardStatsService(userId);
    return sendResponse(res, 200, "Dashboard stats fetched", data);
});
