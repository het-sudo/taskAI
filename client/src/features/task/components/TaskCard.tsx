import { CalendarDays, Mail, Tag, Flag } from "lucide-react"
import { Link } from "react-router-dom"
import type { Task } from "../task.schema"

interface Props {
  task: Task & {
    sharedBy?: string
    isOverdue?: boolean
  }
  onClick?: (task: Task & { sharedBy?: string; isOverdue?: boolean }) => void
}

const statusStyles = {
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  DONE: "bg-emerald-100 text-emerald-700",
}

const priorityStyles = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-rose-100 text-rose-700",
}

export default function TaskCard({ task, onClick }: Props) {
  const cardClassName = `group block rounded-3xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
    task.isOverdue
      ? "border-red-200"
      : "border-slate-200 hover:border-violet-200"
  }`

  const content = (
    <div className="flex h-full flex-col justify-between space-y-4">
      {/* TOP: TITLE + OVERDUE (TOP RIGHT) */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 truncate text-lg font-semibold text-slate-900 transition-colors group-hover:text-violet-600">
          {task.title}
        </h3>

        {task.isOverdue && (
          <span className="shrink-0 rounded-full bg-red-100 px-2 py-1 text-[10px] font-medium text-red-700">
            OVERDUE
          </span>
        )}
      </div>

      {/* DESCRIPTION */}
      {task.description && (
        <p className="line-clamp-2 text-sm text-slate-500">
          {task.description}
        </p>
      )}

      {/* BOTTOM SECTION */}
      <div className="mt-auto flex items-end justify-between gap-3">
        {/* BOTTOM LEFT: STATUS + CATEGORY + PRIORITY */}
        <div className="flex flex-wrap items-center gap-2">
          {/* STATUS (moved here as requested) */}
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-medium ${
              statusStyles[task.status]
            }`}
          >
            {task.status.replace("_", " ")}
          </span>

          {task.category && (
            <span className="flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
              <Tag className="h-3 w-3" />
              {task.category}
            </span>
          )}

          <span
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
              priorityStyles[task.priority]
            }`}
          >
            <Flag className="h-3 w-3" />
            {task.priority}
          </span>
        </div>

        {/* BOTTOM RIGHT: DATE + SHARED BY */}
        <div className="flex flex-wrap items-center justify-end gap-2 text-right">
          {task.dueDate && (
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {task.sharedBy && (
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">Shared by {task.sharedBy}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(task)}
        className={`${cardClassName} w-full cursor-pointer text-left`}
      >
        {content}
      </button>
    )
  }

  return (
    <Link to={`/tasks/${task.id}`} className={cardClassName}>
      {content}
    </Link>
  )
}
