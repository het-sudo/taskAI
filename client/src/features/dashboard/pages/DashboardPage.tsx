import { useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock,
  ListTodo,
  Share2,
  Sparkles,
  Users,
} from "lucide-react"

import { useDashboard } from "../useDashboard"
import StatCard from "../components/StatCard"
import TaskCard from "@/features/task/components/TaskCard"
import SharedTaskDetailModal from "@/features/shareTask/components/SharedTaskDetailModal"
import { useAuthStore } from "@/features/auth/auth.store"
import type { Task } from "@/features/task/task.schema"
import type { DashboardStats } from "../schema"
import DashboardSkeleton from "./DashboardSckeleton"

// returns time-based greeting for dashboard header
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

// checks if a task is overdue (used only in UI rendering)
function isTaskOverdue(task: Task) {
  if (!task.dueDate || task.status === "DONE") return false
  return new Date(task.dueDate) < new Date()
}

// calculates completion percentage safely
function getCompletionRate(stats: DashboardStats) {
  if (stats.totalTasks === 0) return 0
  return Math.round((stats.completedTasks / stats.totalTasks) * 100)
}

export default function DashboardPage() {
  const { data, loading, recentSharedTasks } = useDashboard()
  const user = useAuthStore((state) => state.user)

  // stores selected shared task for modal view
  const [selectedSharedTask, setSelectedSharedTask] = useState<
    (Task & { sharedBy?: string; isOverdue?: boolean }) | null
  >(null)

  // loading state UI
  if (loading) {
    return <DashboardSkeleton />
  }

  // fallback UI when API fails
  if (!data) {
    return (
      <div className="rounded-2xl border p-10 text-center text-slate-500">
        Failed to load dashboard
      </div>
    )
  }

  const { stats, recentTasks } = data

  const completionRate = getCompletionRate(stats)

  // show only latest 5 tasks in dashboard preview
  const displayTasks = recentTasks.slice(0, 5)

  // stat cards config (UI-driven metadata)
  const statCards = [
    {
      label: "Total Tasks",
      value: stats.totalTasks,
      icon: ClipboardList,
      iconClassName: "bg-violet-100 text-violet-600",
      accentClassName: "hover:border-violet-200",
    },
    {
      label: "Completed",
      value: stats.completedTasks,
      icon: CheckCircle2,
      iconClassName: "bg-emerald-100 text-emerald-600",
      accentClassName: "hover:border-emerald-200",
    },
    {
      label: "In Progress",
      value: stats.inProgressTasks,
      icon: Clock,
      iconClassName: "bg-amber-100 text-amber-600",
      accentClassName: "hover:border-amber-200",
    },
    {
      label: "To Do",
      value: stats.todoTasks,
      icon: ListTodo,
      iconClassName: "bg-slate-100 text-slate-600",
      accentClassName: "hover:border-slate-300",
    },
    {
      label: "Overdue",
      value: stats.overdueTasks,
      icon: AlertCircle,
      iconClassName: "bg-red-100 text-red-600",
      accentClassName: "hover:border-red-200",
    },
    {
      label: "Shared With Me",
      value: stats.sharedWithMe,
      icon: Users,
      iconClassName: "bg-blue-100 text-blue-600",
      accentClassName: "hover:border-blue-200",
    },
    {
      label: "Shared By Me",
      value: stats.sharedByMe,
      icon: Share2,
      iconClassName: "bg-indigo-100 text-indigo-600",
      accentClassName: "hover:border-indigo-200",
    },
    {
      label: "Unread Alerts",
      value: stats.unreadNotifications,
      icon: Bell,
      iconClassName: "bg-orange-100 text-orange-600",
      accentClassName: "hover:border-orange-200",
    },
  ]

  // progress bar segments for status visualization
  const statusSegments = [
    { label: "Done", value: stats.completedTasks, color: "bg-emerald-500" },
    {
      label: "In progress",
      value: stats.inProgressTasks,
      color: "bg-amber-500",
    },
    { label: "To do", value: stats.todoTasks, color: "bg-slate-400" },
  ]

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[#fcfaf8] p-6 text-black shadow-lg md:p-8">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* greeting + user name */}
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Your workspace overview
            </div>

            <h1 className="text-2xl font-bold md:text-3xl">
              {getGreeting()}
              {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>

            <p className="mt-2 max-w-xl text-sm text-black">
              Track progress, spot overdue work, and jump back into your latest
              tasks.
            </p>
          </div>

          {/* navigation shortcuts */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/tasks"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              All tasks <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/shared"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-black hover:bg-white/15"
            >
              Shared tasks <Share2 className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS GRID */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      {/* PROGRESS + BREAKDOWN */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* completion rate card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="text-lg font-semibold text-slate-900">
            Completion rate
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {stats.completedTasks} of {stats.totalTasks} tasks finished
          </p>

          <div className="mt-6 flex items-end gap-2">
            <span className="text-4xl font-bold text-violet-600">
              {completionRate}%
            </span>
            <span className="mb-1 text-sm text-slate-500">complete</span>
          </div>

          {/* progress bar */}
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-red-400 transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* status distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Status breakdown
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            How your active tasks are distributed
          </p>

          {/* segmented progress bar */}
          <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-slate-100">
            {statusSegments.map((segment) => {
              const width =
                stats.totalTasks > 0
                  ? (segment.value / stats.totalTasks) * 100
                  : 0

              if (width === 0) return null

              return (
                <div
                  key={segment.label}
                  className={`${segment.color} transition-all`}
                  style={{ width: `${width}%` }}
                  title={`${segment.label}: ${segment.value}`}
                />
              )
            })}
          </div>

          {/* segment labels */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {statusSegments.map((segment) => (
              <div
                key={segment.label}
                className="rounded-xl border bg-slate-50 px-3 py-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${segment.color}`}
                  />
                  <span className="text-xs font-medium text-slate-500">
                    {segment.label}
                  </span>
                </div>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {segment.value}
                </p>
              </div>
            ))}
          </div>

          {/* overdue warning */}
          {stats.overdueTasks > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              {stats.overdueTasks} overdue task
              {stats.overdueTasks > 1 ? "s" : ""} need attention
            </div>
          )}
        </div>
      </section>

      {/* RECENT TASKS */}
      <section className="space-y-4">
        {/* header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent tasks
            </h2>
            <p className="text-sm text-slate-500">
              Last {displayTasks.length} updated tasks
            </p>
          </div>

          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-50"
          >
            View more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* empty state */}
        {displayTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 font-medium text-slate-700">No tasks yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Create your first task to see it here
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {displayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={{ ...task, isOverdue: isTaskOverdue(task) }}
              />
            ))}
          </div>
        )}
      </section>

      {/* SHARED TASKS */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recently shared with me
            </h2>
            <p className="text-sm text-slate-500">
              Latest tasks others have shared with you
            </p>
          </div>

          <Link
            to="/shared"
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-50"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* empty state */}
        {recentSharedTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 font-medium text-slate-700">
              No shared tasks yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              When someone shares a task with you, it will appear here
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recentSharedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={setSelectedSharedTask}
              />
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}
      <SharedTaskDetailModal
        open={!!selectedSharedTask}
        task={selectedSharedTask}
        onClose={() => setSelectedSharedTask(null)}
      />
    </div>
  )
}
