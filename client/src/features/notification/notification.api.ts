import { api } from "@/shared/axios"
import { request } from "@/shared/apiClient"

import type { Notification } from "./notification.schema"

interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
}

export async function getNotificationsRequest() {
  return request<NotificationsResponse>(api.get("/notifications"))
}

export async function toggleNotificationRequest(notificationId: string) {
  return request<Notification>(
    api.patch(`/notifications/${notificationId}/read`)
  )
}
