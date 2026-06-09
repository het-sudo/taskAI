import { Router } from "express"
import { getDashboardStats } from "./controller.js"
import { authMiddleware } from "../auth/middleware.js"
import { IRoute } from "../../routes/route.interface.js"

const router = Router()

router.get("/stats", authMiddleware, getDashboardStats)
export const dashboardRoute: IRoute = {
  path: "/dashboard",
  router: router,
}

export default router
