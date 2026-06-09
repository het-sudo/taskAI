import { Router } from "express"
import { IRoute } from "./route.interface.js"
import { authRoute } from "../modules/auth/routes.js"
import { taskRoute } from "../modules/task/routes.js"
import { notificationRoute } from "../modules/notifications/routes.js"
import { dashboardRoute } from "../modules/dashboard/routes.js"

const rootRouter: Router = Router()

const moduleRoutes: IRoute[] = [
  authRoute,
  taskRoute,
  notificationRoute,
  dashboardRoute,
]

moduleRoutes.forEach((route) => {
  rootRouter.use(route.path, route.router)
})

export default rootRouter
