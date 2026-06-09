import { useEffect, useState } from "react"

import TaskFilters from "../components/TaskFilters"
import TaskList from "../components/TaskList"
import CreateTaskModal from "./CreateTaskModal"
import Pagination from "../components/Pagination"

import { useTask } from "../useTask"

import { Button } from "@/shared/resusable/Button"
import { AppLoader } from "@/shared/AppLoader"
import { PlusCircle } from "lucide-react"

export default function TaskPage() {
  const tasksModule = useTask()

  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    fetchCategories,
    pagination,
    filters,
    setFilters,
    retryFetchTasks,
  } = tasksModule

  const [openCreateModal, setOpenCreateModal] = useState(false)

  useEffect(() => {
    fetchTasks(filters)
    fetchCategories()
  }, [])

  function handlePageChange(page: number) {
    const updated = { ...filters, page }
    setFilters({ page })
    fetchTasks(updated)
  }

  function handleLimitChange(limit: number) {
    const updated = { ...filters, limit, page: 1 }
    setFilters(updated)
    fetchTasks(updated)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">My Tasks</h1>
            <p className="text-sm text-slate-600">Organize and manage work</p>
          </div>

          <Button
            onClick={() => setOpenCreateModal(true)}
            className="w-full shrink-0 sm:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
        <div
          className="
    sticky top-[72px] z-30
    bg-slate-50/95 py-4 backdrop-blur
   
  "
        >
          <TaskFilters {...tasksModule} />
        </div>
        {tasks.length === 0 && isLoading ? (
          <div className="rounded-3xl border p-10 text-center">
            <AppLoader inline />
          </div>
        ) : tasks.length === 0 && error ? (
          <div className="rounded-3xl border p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <Button type="button" onClick={retryFetchTasks}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <TaskList tasks={tasks} />

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              limit={pagination.limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </>
        )}
      </div>

      <CreateTaskModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        tasks={tasksModule}
      />
    </>
  )
}
