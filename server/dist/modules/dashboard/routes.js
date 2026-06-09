import { Router } from "express";
import { getDashboardStats } from "./controller.js";
import { authMiddleware } from "../auth/middleware.js";
const router = Router();
router.get("/stats", authMiddleware, getDashboardStats);
export const dashboardRoute = {
    path: "/dashboard",
    router: router,
};
export default router;
