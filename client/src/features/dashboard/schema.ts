import type { Task } from "../task/task.schema"

export interface DashboardStats {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  todoTasks: number
  overdueTasks: number
  sharedWithMe: number
  sharedByMe: number
  unreadNotifications: number
}

export interface DashboardResponse {
  stats: DashboardStats
  recentTasks: Task[]
}
