import { api } from "@/shared/axios"
import { request } from "@/shared/apiClient"
import type { DashboardResponse } from "./schema"

export const getDashboardRequest = () =>
  request<DashboardResponse>(api.get("/dashboard/stats"))
