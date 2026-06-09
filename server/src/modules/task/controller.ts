import { StatusCodes } from "http-status-codes"
import { Response } from "express"

import asyncHandler from "../../utils/asyncHandler.js"
import logger from "../../utils/logger.js"
import sendResponse from "../../utils/sendResponse.js"
import ApiError from "../../utils/apiError.js"

import {
  createTaskService,
  deleteTaskService,
  getCategories,
  getSharedCategories,
  getSharedTasksService,
  getTaskByIdService,
  getTasksService,
  shareTaskService,
  updateTaskService,
} from "./service.js"

import { AuthRequest } from "../auth/middleware.js"
import {
  CreateTaskInput,
  TaskFiltersInput,
  TaskIdInput,
  UpdateTaskInput,
} from "./validator.js"

export const createTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    logger.info("create task request received", {
      userId: req.user?.userId,
    })

    const task = await createTaskService(
      req.user!.userId,
      req.validated.body as CreateTaskInput
    )

    logger.info("task created successfully", {
      taskId: task.id,
      userId: req.user?.userId,
    })

    return sendResponse(
      res,
      StatusCodes.CREATED,
      "Task created successfully",
      task
    )
  }
)

export const getTasks = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    logger.info("get tasks request received", {
      userId: req.user?.userId,
    })

    const result = await getTasksService(
      req.user!.userId,
      req.validated.query as TaskFiltersInput
    )

    logger.info("tasks fetched successfully", {
      userId: req.user?.userId,
    })

    return sendResponse(
      res,
      StatusCodes.OK,
      "Tasks fetched successfully",
      result
    )
  }
)

export const getTaskById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    logger.info("get task request received", {
      taskId: req.params.id,
      userId: req.user?.userId,
    })

    const { id } = req.validated.params as TaskIdInput
    const task = await getTaskByIdService(req.user!.userId, id)

    if (!task) {
      logger.warn("task not found", {
        taskId: req.params.id,
        userId: req.user?.userId,
      })

      throw new ApiError(StatusCodes.NOT_FOUND, "Task not found")
    }

    return sendResponse(res, StatusCodes.OK, "Task fetched successfully", task)
  }
)

export const updateTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    logger.info("update task request received", {
      taskId: req.params.id,
      userId: req.user?.userId,
    })
    const { id } = req.validated.params as TaskIdInput
    const task = await updateTaskService(
      req.user!.userId,
      id,
      req.validated.body as UpdateTaskInput
    )

    if (!task) {
      logger.warn("task not found for update", {
        taskId: req.params.id,
        userId: req.user?.userId,
      })

      throw new ApiError(StatusCodes.NOT_FOUND, "Task not found")
    }

    logger.info("task updated successfully", {
      taskId: task.id,
      userId: req.user?.userId,
    })

    return sendResponse(res, StatusCodes.OK, "Task updated successfully", task)
  }
)

export const deleteTask = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    logger.info("delete task request received", {
      taskId: req.params.id,
      userId: req.user?.userId,
    })
    const { id } = req.validated.params as TaskIdInput
    const task = await deleteTaskService(req.user!.userId, id)

    if (!task) {
      logger.warn("task not found for deletion", {
        taskId: req.params.id,
        userId: req.user?.userId,
      })

      throw new ApiError(StatusCodes.NOT_FOUND, "Task not found")
    }

    logger.info("task deleted successfully", {
      taskId: req.params.id,
      userId: req.user?.userId,
    })

    return sendResponse(res, StatusCodes.OK, "Task deleted successfully")
  }
)

export const getTaskCategories = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    logger.info("get task categories request received", {
      userId: req.user?.userId,
    })

    const categories = await getCategories(req.user!.userId)

    logger.info("task categories fetched successfully", {
      userId: req.user?.userId,
    })

    return sendResponse(
      res,
      StatusCodes.OK,
      "Task categories fetched successfully",
      categories
    )
  }
)

export const shareTask = asyncHandler(async (req: AuthRequest, res) => {
  const ownerId = req.user?.userId

  if (!ownerId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized")
  }

  const taskId = req.params.id as string
  const { email } = req.body

  const { notification, sharedWithId } = await shareTaskService(
    ownerId,
    taskId,
    email
  )

  return sendResponse(res, StatusCodes.OK, "Task shared successfully", {
    notificationId: notification.id,
    sharedWithId,
  })
})

export const getSharedTaskCategories = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const categories = await getSharedCategories(req.user!.userId)

    return sendResponse(
      res,
      StatusCodes.OK,
      "Shared task categories fetched successfully",
      categories
    )
  }
)

export const getSharedTasks = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    logger.info("get shared tasks request received", {
      userId: req.user?.userId,
    })

    const filters = req.validated.query as TaskFiltersInput
    const result = await getSharedTasksService(req.user!.userId, filters)

    return sendResponse(
      res,
      StatusCodes.OK,
      "Shared tasks fetched successfully",
      result
    )
  }
)
