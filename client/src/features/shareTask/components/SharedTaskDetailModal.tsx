import { CalendarDays, Mail, Tag, User, X, AlertCircle } from "lucide-react"

import { Modal } from "@/shared/resusable/Modal"
import { Button } from "@/shared/resusable/Button"
import type { Task } from "@/features/task/task.schema"

type Props = {
  open: boolean
  onClose: () => void
  task: (Task & { sharedBy?: string; isOverdue?: boolean }) | null
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

export default function SharedTaskDetailModal({ open, onClose, task }: Props) {
  if (!task) return null

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-slate-900">{task.title}</h2>
          <p className="mt-1 text-sm text-slate-500">
            Shared task details (read-only)
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {task.isOverdue && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          This task is overdue
        </div>
      )}

      {task.description && (
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">Description</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {task.description}
          </p>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {task.category && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
            <Tag className="h-3.5 w-3.5" />
            {task.category}
          </span>
        )}

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[task.status]
          }`}
        >
          {task.status.replace("_", " ")}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            priorityStyles[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        {task.sharedBy && (
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <User className="h-4 w-4 shrink-0 text-slate-400" />
            <span>
              Shared by <span className="font-medium">{task.sharedBy}</span>
            </span>
          </div>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
            <span>
              Due{" "}
              <span className="font-medium">
                {new Date(task.dueDate).toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Mail className="h-4 w-4 shrink-0 text-slate-400" />
          <span>
            Created {new Date(task.createdAt).toLocaleDateString()} · Updated{" "}
            {new Date(task.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  )
}
