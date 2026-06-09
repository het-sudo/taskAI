import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { CornerDownLeft, Share2 } from "lucide-react"

import EditTaskForm from "./EditTaskForm"
import { AppLoader } from "@/shared/AppLoader"

import { useTask } from "../useTask"
import { Button } from "@/shared/resusable/Button"
import ShareTaskModal from "../../shareTask/components/ShareTaskModal"

export default function TaskDetail() {
  const { id } = useParams()

  const tasks = useTask()

  const { selectedTask, getTaskById, isDetailLoading } = tasks

  const [openShare, setOpenShare] = useState(false)

  useEffect(() => {
    if (id) {
      getTaskById(id)
    }
  }, [id, getTaskById])

  if (isDetailLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <AppLoader inline />
      </div>
    )
  }

  if (!selectedTask) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-slate-500">Task not found.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-3">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-sm font-medium text-red-400 transition hover:text-red-500"
        >
          <CornerDownLeft />
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            {selectedTask.title}
          </h1>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setOpenShare(true)}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* EDIT FORM */}
      <EditTaskForm taskId={id!} tasks={tasks} />
      {openShare && (
        <ShareTaskModal
          taskId={selectedTask.id}
          onClose={() => setOpenShare(false)}
        />
      )}
    </div>
  )
}
