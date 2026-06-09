import { Router } from "express"

import {
  createTask,
  deleteTask,
  getSharedTasks,
  getSharedTaskCategories,
  getTaskById,
  getTaskCategories,
  getTasks,
  shareTask,
  updateTask,
} from "./controller.js"

import {
  createTaskSchema,
  shareTaskSchema,
  taskFiltersSchema,
  taskIdSchema,
  updateTaskSchema,
} from "./validator.js"

import { validate } from "../../middleware/validate.middleware.js"

import { authMiddleware } from "../auth/middleware.js"

import { IRoute } from "../../routes/route.interface.js"

const router = Router()

router.post(
  "/",
  authMiddleware,
  validate({
    body: createTaskSchema,
  }),
  createTask
)

router.get(
  "/",
  authMiddleware,
  validate({
    query: taskFiltersSchema,
  }),
  getTasks
)

router.get("/categories", authMiddleware, getTaskCategories)

router.get(
  "/shared-with-me/categories",
  authMiddleware,
  getSharedTaskCategories
)

router.get(
  "/shared-with-me",
  authMiddleware,
  validate({
    query: taskFiltersSchema,
  }),
  getSharedTasks
)

router.post(
  "/:id/share",
  authMiddleware,
  validate({
    params: taskIdSchema,
    body: shareTaskSchema,
  }),
  shareTask
)

router.get(
  "/:id",
  authMiddleware,
  validate({
    params: taskIdSchema,
  }),
  getTaskById
)

router.put(
  "/:id",
  authMiddleware,
  validate({
    params: taskIdSchema,

    body: updateTaskSchema,
  }),
  updateTask
)

router.delete(
  "/:id",
  authMiddleware,
  validate({
    params: taskIdSchema,
  }),
  deleteTask
)

export const taskRoute: IRoute = {
  path: "/tasks",
  router: router,
}
