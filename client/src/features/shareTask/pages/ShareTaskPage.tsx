import { useEffect, useState } from "react"

import TaskFilters from "@/features/task/components/TaskFilters"
import TaskList from "@/features/task/components/TaskList"
import Pagination from "@/features/task/components/Pagination"
import { AppLoader } from "@/shared/AppLoader"
import type { Task } from "@/features/task/task.schema"

import SharedTaskDetailModal from "../components/SharedTaskDetailModal"
import { useShareTask } from "../useShare"
import { Button } from "@/shared/resusable/Button"

export default function SharedTasksPage() {
  // Stores currently selected task for detail modal
  const [selectedTask, setSelectedTask] = useState<
    (Task & { sharedBy?: string; isOverdue?: boolean }) | null
  >(null)

  // Custom hook handling shared task logic (API, filters, pagination)
  const shareModule = useShareTask()

  const {
    tasks,
    isLoading,
    error,
    fetchSharedTasks,
    fetchCategories,
    pagination,
    filters,
    setFilters,
    retryFetchSharedTasks,
  } = shareModule

  // Initial data fetch (tasks + categories)
  useEffect(() => {
    fetchSharedTasks(filters)
    fetchCategories()
  }, [])

  // Handle page change in pagination
  function handlePageChange(page: number) {
    const updated = { ...filters, page }
    setFilters({ page })
    fetchSharedTasks(updated)
  }

  // Handle items per page change
  function handleLimitChange(limit: number) {
    const updated = { ...filters, limit, page: 1 }
    setFilters(updated)
    fetchSharedTasks(updated)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold">Shared With Me</h1>
        <p className="text-sm text-slate-600">Tasks shared by other users</p>
      </div>

      {/* Sticky filter bar for better UX while scrolling */}
      <div className="sticky top-[72px] z-30 bg-slate-50/95 py-4 backdrop-blur">
        <TaskFilters
          filters={filters}
          setFilters={setFilters}
          categories={shareModule.categories}
          fetchTasks={fetchSharedTasks}
        />
      </div>

      {/* Loading state (initial fetch only) */}
      {tasks.length === 0 && isLoading ? (
        <div className="rounded-3xl border p-10 text-center">
          <AppLoader inline />
        </div>
      ) : tasks.length === 0 && error ? (
        // Error state with retry option
        <div className="rounded-3xl border p-10 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <Button type="button" onClick={retryFetchSharedTasks}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          {/* Task list */}
          <TaskList tasks={tasks} onTaskClick={setSelectedTask} />

          {/* Pagination controls */}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            limit={pagination.limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      )}

      {/* Task detail modal */}
      <SharedTaskDetailModal
        open={!!selectedTask}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  )
}
