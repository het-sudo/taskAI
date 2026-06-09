import TaskCard from "./TaskCard"

import type { Task } from "../task.schema"

interface Props {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
}

export default function TaskList({ tasks, onTaskClick }: Props) {
  if (!tasks.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm">
        <div className="mx-auto max-w-sm">
          <h3 className="text-lg font-semibold text-slate-800">
            No tasks found
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Try adjusting your filters or create a new task to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onClick={onTaskClick} />
      ))}
    </div>
  )
}
