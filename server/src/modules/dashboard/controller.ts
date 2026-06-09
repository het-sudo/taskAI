import { Response } from "express"
import asyncHandler from "../../utils/asyncHandler.js"
import sendResponse from "../../utils/sendResponse.js"
import { AuthRequest } from "../auth/middleware.js"
import { getDashboardStatsService } from "./service.js"
export const getDashboardStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId

    const data = await getDashboardStatsService(userId)

    return sendResponse(res, 200, "Dashboard stats fetched", data)
  }
)
