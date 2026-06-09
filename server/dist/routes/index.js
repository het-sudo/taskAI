import { Router } from "express";
import { authRoute } from "../modules/auth/routes.js";
import { taskRoute } from "../modules/task/routes.js";
import { notificationRoute } from "../modules/notifications/routes.js";
import { dashboardRoute } from "../modules/dashboard/routes.js";
const rootRouter = Router();
const moduleRoutes = [
    authRoute,
    taskRoute,
    notificationRoute,
    dashboardRoute,
];
moduleRoutes.forEach((route) => {
    rootRouter.use(route.path, route.router);
});
export default rootRouter;
