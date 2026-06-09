import { Prisma, PrismaClient } from "@prisma/client"
import {
  CreateTaskInput,
  TaskFiltersInput,
  UpdateTaskInput,
} from "./validator.js"
import ApiError from "../../utils/apiError.js"
import { StatusCodes } from "http-status-codes"
import { emitNotification, emitTaskShared } from "../../socket/event.js"

const prisma = new PrismaClient()

// create a new task for a user (owner-based)
export async function createTaskService(
  ownerId: string,
  data: CreateTaskInput
) {
  return prisma.task.create({
    data: {
      ...data,
      ownerId,
    },
  })
}

// fetch all tasks with filtering, pagination, and search support
export async function getTasksService(
  ownerId: string,
  filters: TaskFiltersInput
) {
  const { status, priority, category, search, page, limit } = filters

  // base query ensures only active (non-deleted) user tasks
  const where: Prisma.TaskWhereInput = {
    ownerId,
    deletedAt: null,
  }

  if (status) {
    where.status = status
  }
  if (priority) {
    where.priority = priority
  }

  // category filter (case-insensitive match)
  if (category) {
    where.category = {
      equals: category,
      mode: "insensitive",
    }
  }

  // search across title + description
  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ]
  }

  const skip = (page - 1) * limit

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),

    prisma.task.count({
      where,
    }),
  ])

  const now = new Date()

  // add computed field: whether task is overdue
  const tasksWithOverdue = tasks.map((task) => ({
    ...task,
    isOverdue:
      task.status !== "DONE" && !!task.dueDate && new Date(task.dueDate) < now,
  }))

  return {
    tasks: tasksWithOverdue,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

// get single task by id (only if owned by user)
export async function getTaskByIdService(ownerId: string, taskId: string) {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      ownerId,
      deletedAt: null,
    },
  })
}

// update task after verifying ownership
export async function updateTaskService(
  ownerId: string,
  taskId: string,
  data: UpdateTaskInput
) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      ownerId,
      deletedAt: null,
    },
  })

  if (!task) {
    return null
  }

  return prisma.task.update({
    where: {
      id: taskId,
    },
    data,
  })
}

// soft delete task (marks as deleted instead of removing)
export async function deleteTaskService(ownerId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      ownerId,
      deletedAt: null,
    },
  })

  if (!task) {
    return null
  }

  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      deletedAt: new Date(),
    },
  })
}

// get unique categories for a user's tasks
export async function getCategories(ownerId: string) {
  const categories = await prisma.task.findMany({
    where: {
      ownerId,
      deletedAt: null,
    },
    select: {
      category: true,
    },
    distinct: ["category"],
    orderBy: {
      category: "asc",
    },
  })

  return categories.map((item) => item.category)
}

// share task with another user + trigger notification + socket event
export async function shareTaskService(
  ownerId: string,
  taskId: string,
  email: string
) {
  const result = await prisma.$transaction(async (tx) => {
    const task = await tx.task.findFirst({
      where: {
        id: taskId,
        ownerId,
        deletedAt: null,
      },
      include: {
        owner: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    })

    if (!task) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Task not found")
    }

    const sharedWith = await tx.user.findUnique({
      where: { email },
    })

    if (!sharedWith) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found")
    }

    if (sharedWith.id === ownerId) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "You cannot share task with yourself"
      )
    }

    const existingShare = await tx.taskShare.findUnique({
      where: {
        taskId_sharedWithId: {
          taskId,
          sharedWithId: sharedWith.id,
        },
      },
    })

    if (existingShare) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Task already shared with this user"
      )
    }

    // create share record
    const share = await tx.taskShare.create({
      data: {
        taskId,
        sharedWithId: sharedWith.id,
        sharedById: ownerId,
      },
      include: {
        task: {
          include: {
            owner: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    })

    // create notification record for receiver
    const notification = await tx.notification.create({
      data: {
        userId: sharedWith.id,
        taskId,
        type: "TASK_SHARED",
        message: `Task "${task.title}" was shared with you by ${task.owner.email}`,
      },
    })

    return {
      sharedWithId: sharedWith.id,
      notification,
      share,
    }
  })

  // emit real-time notification after DB commit
  emitNotification(result.sharedWithId, result.notification)

  // emit task shared event for UI updates
  emitTaskShared(result.sharedWithId, result.share)

  return result
}

// get tasks shared with a user (with filters + pagination)
export async function getSharedTasksService(
  userId: string,
  filters: TaskFiltersInput
) {
  const { status, priority, category, search, page, limit } = filters

  const taskWhere: Prisma.TaskWhereInput = {
    deletedAt: null,
  }

  if (status) taskWhere.status = status
  if (priority) taskWhere.priority = priority

  // category filter for shared tasks
  if (category) {
    taskWhere.category = { equals: category, mode: "insensitive" }
  }

  // search across title + description
  if (search) {
    taskWhere.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  const where: Prisma.TaskShareWhereInput = {
    sharedWithId: userId,
    task: taskWhere,
  }

  const skip = (page - 1) * limit

  const [sharedTasks, total] = await Promise.all([
    prisma.taskShare.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        task: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    }),
    prisma.taskShare.count({ where }),
  ])

  const now = new Date()

  // transform shared tasks with extra computed fields
  const tasks = sharedTasks.map((share) => ({
    ...share.task,
    sharedBy: share.task.owner.email,
    isOverdue:
      share.task.status !== "DONE" &&
      !!share.task.dueDate &&
      new Date(share.task.dueDate) < now,
  }))

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  }
}

// get unique categories from shared tasks
export async function getSharedCategories(userId: string) {
  const categories = await prisma.task.findMany({
    where: {
      deletedAt: null,
      shares: { some: { sharedWithId: userId } },
    },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  })

  return categories.map((item) => item.category)
}
