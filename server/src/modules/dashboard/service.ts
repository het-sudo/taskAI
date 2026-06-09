import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// dashboard aggregation service (single optimized query batch using Promise.all)
export async function getDashboardStatsService(userId: string) {
  const [
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    overdueTasks,
    sharedWithMe,
    sharedByMe,
    unreadNotifications,
    recentTasks,
  ] = await Promise.all([
    // total active tasks owned by user
    prisma.task.count({ where: { ownerId: userId, deletedAt: null } }),

    // completed tasks count
    prisma.task.count({
      where: { ownerId: userId, status: "DONE", deletedAt: null },
    }),

    // tasks currently in progress
    prisma.task.count({
      where: { ownerId: userId, status: "IN_PROGRESS", deletedAt: null },
    }),

    // pending tasks
    prisma.task.count({
      where: { ownerId: userId, status: "TODO", deletedAt: null },
    }),

    // overdue tasks (past due date + not completed)
    prisma.task.count({
      where: {
        ownerId: userId,
        dueDate: { lt: new Date() },
        status: { not: "DONE" },
        deletedAt: null,
      },
    }),

    // tasks shared with this user
    prisma.taskShare.count({
      where: { sharedWithId: userId },
    }),

    // tasks shared by this user
    prisma.taskShare.count({
      where: { sharedById: userId },
    }),

    // unread notification count for badge
    prisma.notification.count({
      where: { userId, isRead: false },
    }),

    // latest updated tasks for dashboard preview section
    prisma.task.findMany({
      where: { ownerId: userId, deletedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ])

  return {
    stats: {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      sharedWithMe,
      sharedByMe,
      unreadNotifications,
    },
    recentTasks,
  }
}
