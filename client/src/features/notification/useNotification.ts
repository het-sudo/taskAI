import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import {
  getNotificationsRequest,
  toggleNotificationRequest,
} from "./notification.api"

import type { Notification } from "./notification.schema"
import { getSocket } from "@/libs/socket"

export function useNotification() {
  // Local state for notifications list
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Count of unread notifications (from backend + local updates)
  const [unreadCount, setUnreadCount] = useState(0)

  // Loading state for initial fetch
  const [isLoading, setIsLoading] = useState(true)

  // Fetch all notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await getNotificationsRequest()

      setNotifications(res.notifications)
      setUnreadCount(res.unreadCount)
    } finally {
      // Ensure loading is stopped even if request fails
      setIsLoading(false)
    }
  }, [])

  // Toggle single notification read/unread state
  const toggleRead = useCallback(async (notificationId: string) => {
    const updated = await toggleNotificationRequest(notificationId)

    // Update only the modified notification in state
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? updated : n))
    )

    // Adjust unread count based on new state
    setUnreadCount((prev) =>
      updated.isRead ? Math.max(prev - 1, 0) : prev + 1
    )
  }, [])

  // Mark all unread notifications as read
  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.isRead)

    // No-op if everything is already read
    if (unread.length === 0) return

    try {
      // Call API for each unread notification
      const updatedList = await Promise.all(
        unread.map((n) => toggleNotificationRequest(n.id))
      )

      // Convert updated list into lookup map for fast merge
      const updatedById = new Map(updatedList.map((n) => [n.id, n]))

      // Merge updated notifications into state
      setNotifications((prev) => prev.map((n) => updatedById.get(n.id) ?? n))

      // All notifications are now read
      setUnreadCount(0)

      toast.success("All notifications marked as read")
    } catch {
      toast.error("Could not mark all as read")

      // fallback: refetch to ensure consistency
      fetchNotifications()
    }
  }, [notifications, fetchNotifications])

  // Initial load of notifications on mount
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Socket listener for realtime notifications
  useEffect(() => {
    const handleNew = (notification: Notification) => {
      // prepend new notification to list
      setNotifications((prev) => [notification, ...prev])

      // increment unread count locally
      setUnreadCount((prev) => prev + 1)

      // show toast for realtime update
      toast.success(notification.message)
    }

    // Attach socket listener safely
    const subscribe = () => {
      const socket = getSocket()
      if (!socket) return

      // prevent duplicate listeners
      socket.off("notification:new", handleNew)
      socket.on("notification:new", handleNew)
    }

    // initial subscription
    subscribe()

    const socket = getSocket()

    // re-subscribe after reconnect
    socket?.on("connect", subscribe)

    // cleanup listeners on unmount
    return () => {
      socket?.off("connect", subscribe)
      getSocket()?.off("notification:new", handleNew)
    }
  }, [])

  return {
    notifications,
    unreadCount,

    // derived value (no need for separate state)
    readCount: notifications.filter((n) => n.isRead).length,

    isLoading,
    fetchNotifications,
    toggleRead,
    markAllAsRead,
  }
}
