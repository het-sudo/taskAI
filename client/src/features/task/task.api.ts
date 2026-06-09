import { api } from "@/shared/axios"
import { request } from "@/shared/apiClient"

import type {
  CreateTaskInput,
  Task,
  TaskFiltersInput,
  TasksResponse,
  UpdateTaskInput,
} from "./task.schema"

export async function getTasksRequest(filters?: TaskFiltersInput) {
  return request<TasksResponse>(api.get("/tasks", { params: filters }))
}

export async function getTaskByIdRequest(id: string) {
  return request<Task>(api.get(`/tasks/${id}`))
}

export async function createTaskRequest(payload: CreateTaskInput) {
  return request<Task>(api.post("/tasks", payload))
}

export async function updateTaskRequest(id: string, payload: UpdateTaskInput) {
  return request<Task>(api.put(`/tasks/${id}`, payload))
}

export async function deleteTaskRequest(id: string) {
  return request<null>(api.delete(`/tasks/${id}`))
}

export async function getCategoriesRequest() {
  return request<string[]>(api.get("/tasks/categories"))
}
