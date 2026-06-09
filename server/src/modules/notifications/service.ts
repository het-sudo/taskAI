import prisma from "../../lib/prisma.js"

// fetch all notifications + unread count for a user
export async function getNotificationsService(userId: string) {
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: {
        userId,
      },

      // latest notifications first (inbox style)
      orderBy: {
        createdAt: "desc",
      },

      // include minimal task info for UI context
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),

    // count only unread notifications for badge indicator
    prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    }),
  ])

  return {
    notifications,
    unreadCount,
  }
}

/**
 * Toggle notification read/unread status
 */
export async function markNotificationReadService(
  userId: string,
  notificationId: string
) {
  // find notification belonging to user (security check)
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  })

  if (!notification) {
    return null
  }

  // toggle read state instead of hard setting
  return prisma.notification.update({
    where: {
      id: notificationId,
    },

    data: {
      isRead: !notification.isRead,
    },
  })
}
