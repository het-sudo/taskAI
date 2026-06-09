import { api } from "@/shared/axios"
import { request } from "@/shared/apiClient"

import type { SharedTasksResponse, TaskFiltersInput } from "./schema"

export async function shareTaskRequest(taskId: string, email: string) {
  return request(
    api.post(`/tasks/${taskId}/share`, {
      email,
    })
  )
}

export async function getSharedTasksRequest(filters?: TaskFiltersInput) {
  return request<SharedTasksResponse>(
    api.get("/tasks/shared-with-me", { params: filters })
  )
}

export async function getSharedCategoriesRequest() {
  return request<string[]>(api.get("/tasks/shared-with-me/categories"))
}
