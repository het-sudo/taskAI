import { z } from "zod"

export const TASK_STATUS = ["TODO", "IN_PROGRESS", "DONE"] as const

export const TASK_PRIORITY = ["LOW", "MEDIUM", "HIGH"] as const

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100),
  description: z.string().trim().min(1, "Description is required").max(1000),
  category: z.string().trim().min(1).max(50),
  priority: z.enum(TASK_PRIORITY).optional(),
  status: z.enum(TASK_STATUS).optional(),
  dueDate: z.string().min(1, "Due Date is required").optional(),
})

export const updateTaskSchema = createTaskSchema.partial()

export const taskFiltersSchema = z.object({
  status: z.enum(TASK_STATUS).optional(),
  priority: z.enum(TASK_PRIORITY).optional(),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
})

export type TaskStatus = (typeof TASK_STATUS)[number]

export type TaskPriority = (typeof TASK_PRIORITY)[number]

export type CreateTaskInput = z.infer<typeof createTaskSchema>

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>

export type TaskFiltersInput = z.infer<typeof taskFiltersSchema>

export interface Task {
  id: string
  title: string
  description?: string | null
  category: string
  priority: TaskPriority
  status: TaskStatus
  dueDate?: string | null
  createdAt: string
  updatedAt: string
  isOverdue?: boolean
  sharedBy?: string
}

export interface TasksResponse {
  tasks: Task[]

  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
