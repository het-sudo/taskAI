import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import {
  Bell,
  BellOff,
  CheckCheck,
  CheckCircle2,
  Circle,
  Share2,
  X,
} from "lucide-react"

import { useNotification } from "@/features/notification/useNotification"
import type {
  Notification,
  NotificationFilter,
} from "@/features/notification/notification.schema"
import { useClickOutside } from "@/shared/hooks/useClickOutside"
import { AppLoader } from "@/shared/AppLoader"

// formats notification timestamp into human-readable relative time
function formatNotificationTime(date: string) {
  const value = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - value.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  return value.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// chooses icon based on notification type
function NotificationIcon({ type }: { type: Notification["type"] }) {
  if (type === "TASK_SHARED") {
    return <Share2 className="h-5 w-5 text-red-400" />
  }

  return <Bell className="h-5 w-5 text-slate-600" />
}

// filters notifications based on selected tab
function filterNotifications(list: Notification[], filter: NotificationFilter) {
  if (filter === "unread") return list.filter((n) => !n.isRead)
  if (filter === "read") return list.filter((n) => n.isRead)
  return list
}

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    readCount,
    isLoading,
    toggleRead,
    markAllAsRead,
  } = useNotification()

  // controls dropdown open/close state
  const [open, setOpen] = useState(false)

  // active filter tab (all/read/unread)
  const [filter, setFilter] = useState<NotificationFilter>("all")

  // tracks which notification is currently being updated
  const [markingId, setMarkingId] = useState<string | null>(null)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // closes notification panel
  const close = useCallback(() => setOpen(false), [])

  // close panel when clicking outside
  useClickOutside([triggerRef, panelRef], close, open)

  // handle escape key + prevent background scroll when panel is open
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close()
    }

    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, close])

  // memoized filtered notifications (performance optimization)
  const filtered = useMemo(
    () => filterNotifications(notifications, filter),
    [notifications, filter]
  )

  // tab configuration for UI
  const tabs: { key: NotificationFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "read", label: "Read", count: readCount },
  ]

  // toggle read/unread state for a notification
  async function handleToggleRead(notificationId: string) {
    setMarkingId(notificationId)
    try {
      await toggleRead(notificationId)
    } finally {
      setMarkingId(null)
    }
  }

  return (
    <>
      {/* notification bell button */}
      <button
        ref={triggerRef}
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-100"
      >
        <Bell className="h-5 w-5 text-slate-700" />

        {/* unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-400 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* portal renders dropdown outside normal DOM hierarchy */}
      {open &&
        createPortal(
          <>
            {/* overlay background */}
            <div
              className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-[2px]"
              aria-hidden
            />

            {/* notification panel */}
            <div className="fixed inset-0 z-[201] flex items-start justify-center p-4 pt-[88px] sm:justify-end sm:p-6 sm:pt-[88px]">
              <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Notifications"
                className="flex max-h-[min(640px,calc(100vh-6rem))] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
              >
                {/* header section */}
                <div className="border-b border-slate-100 bg-gradient-to-br bg-[#fcfaf8] px-5 py-4 text-white">
                  <div className="flex items-start text-slate-500 justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">Notifications</h2>
                      <p className="mt-0.5 text-sm">
                        {unreadCount} unread · {notifications.length} total
                      </p>
                    </div>

                    {/* close button */}
                    <button
                      type="button"
                      onClick={close}
                      aria-label="Close notifications"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* mark all read action */}
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-black transition hover:bg-white/20"
                    >
                      <CheckCheck className="h-4 w-4" />
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* filter tabs */}
                <div className="flex gap-1 border-b border-slate-100 bg-slate-50 p-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setFilter(tab.key)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                        filter === tab.key
                          ? "bg-white text-red-400 shadow-sm"
                          : "text-slate-600 hover:bg-white/70"
                      }`}
                    >
                      {tab.label}
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                          filter === tab.key
                            ? "bg-violet-100 text-red-400"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* notifications list */}
                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center py-16">
                      <AppLoader inline />
                    </div>
                  ) : filtered.length === 0 ? (
                    // empty state UI
                    <div className="flex flex-col items-center px-6 py-14 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                        {filter === "unread" ? (
                          <BellOff className="h-7 w-7 text-slate-400" />
                        ) : (
                          <Bell className="h-7 w-7 text-slate-400" />
                        )}
                      </div>
                      <p className="mt-4 font-medium text-slate-800">
                        {filter === "unread"
                          ? "You're all caught up"
                          : filter === "read"
                            ? "No read notifications"
                            : "No notifications yet"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {filter === "all"
                          ? "Task shares and updates will show up here"
                          : "Try another filter"}
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {filtered.map((notification) => (
                        <li
                          key={notification.id}
                          className={`p-4 transition ${
                            notification.isRead ? "bg-white" : "bg-violet-50/50"
                          }`}
                        >
                          <div className="flex gap-3">
                            {/* notification icon */}
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                                notification.isRead
                                  ? "bg-slate-100"
                                  : "bg-violet-100"
                              }`}
                            >
                              <NotificationIcon type={notification.type} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                {/* message text */}
                                <p
                                  className={`text-sm leading-relaxed ${
                                    notification.isRead
                                      ? "text-slate-600"
                                      : "font-semibold text-slate-900"
                                  }`}
                                >
                                  {notification.message}
                                </p>

                                {/* unread indicator dot */}
                                {!notification.isRead && (
                                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                                )}
                              </div>

                              {/* link to related task */}
                              {notification.task && (
                                <Link
                                  to={`/shared`}
                                  onClick={close}
                                  className="mt-1.5 inline-block text-xs font-medium text-red-400 hover:text-red-400"
                                >
                                  View task: {notification.task.title}
                                </Link>
                              )}

                              {/* timestamp */}
                              <p className="mt-2 text-xs text-slate-400">
                                {formatNotificationTime(notification.createdAt)}
                              </p>

                              {/* toggle read/unread */}
                              <button
                                type="button"
                                disabled={markingId === notification.id}
                                onClick={() =>
                                  handleToggleRead(notification.id)
                                }
                                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700 disabled:opacity-50"
                              >
                                {notification.isRead ? (
                                  <>
                                    <Circle className="h-3.5 w-3.5" />
                                    Mark unread
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Mark read
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  )
}
