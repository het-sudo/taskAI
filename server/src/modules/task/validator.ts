import { z } from "zod"

import { TaskPriority, TaskStatus } from "@prisma/client"

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100),
  description: z.string().trim().max(1000),
  category: z.string().trim().min(1).max(50),
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  dueDate: z
    .string()
    .datetime()
    .optional()
    .refine((date) => !date || isFutureDate(date), {
      message: "Due date cannot be in the past",
    }),
})

export const updateTaskSchema = createTaskSchema.partial()

export const taskFiltersSchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  category: z.string().trim().optional(),
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
})

export const taskIdSchema = z.object({
  id: z.string().uuid(),
})

export const shareTaskSchema = z.object({
  email: z.string().email("Invalid Email Address"),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>

export type TaskFiltersInput = z.infer<typeof taskFiltersSchema>

export type TaskIdInput = z.infer<typeof taskIdSchema>

export type shareTaskInput = z.infer<typeof shareTaskSchema>

function isFutureDate(date: string) {
  const inputDate = new Date(date)

  if (Number.isNaN(inputDate.getTime())) {
    return false
  }

  inputDate.setHours(0, 0, 0, 0)

  const today = new Date()

  today.setHours(0, 0, 0, 0)

  return inputDate >= today
}
