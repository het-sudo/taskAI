import type { Task, TaskFiltersInput } from "../task/task.schema"

export type { TaskFiltersInput }

export interface SharedTask {
  id: string
  createdAt: string

  task: Task & {
    owner: {
      id: string
      name: string
      email: string
    }
  }
}

export interface SharedTasksResponse {
  tasks: (Task & { sharedBy?: string; isOverdue?: boolean })[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
