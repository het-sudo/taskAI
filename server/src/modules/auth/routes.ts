import { Router } from "express"
import { authMiddleware } from "./middleware.js"
import { loginSchema, registerSchema } from "./validator.js"
import { getMe, login, logout, refreshToken, register } from "./controller.js"
import { IRoute } from "../../routes/route.interface.js"
import { validate } from "../../middleware/validate.middleware.js"

const router = Router()
router.post("/register", validate({ body: registerSchema }), register)
router.post("/login", validate({ body: loginSchema }), login)
router.post("/logout", authMiddleware, logout)
router.post("/refresh-token", refreshToken)
router.get("/me", authMiddleware, getMe)

export const authRoute: IRoute = {
  path: "/auth",
  router: router,
}
