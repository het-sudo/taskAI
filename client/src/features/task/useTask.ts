import { useCallback, useState } from "react"
import { toast } from "sonner"

import type {
  Task,
  TaskFiltersInput,
  CreateTaskInput,
  UpdateTaskInput,
  TasksResponse,
} from "./task.schema"

import {
  getTasksRequest,
  getTaskByIdRequest,
  createTaskRequest,
  updateTaskRequest,
  deleteTaskRequest,
  getCategoriesRequest,
} from "./task.api"

import { getErrorMessage } from "@/libs/getErrorMessage"

type FetchOptions = {
  silent?: boolean
}

export function useTask() {
  // Main task list state
  const [tasks, setTasks] = useState<Task[]>([])

  // Currently selected task (for detail modal/view)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Available categories for filters
  const [categories, setCategories] = useState<string[]>([])

  // Global error state for UI feedback
  const [error, setError] = useState<string | null>(null)

  // Active filters used for API calls
  const [filters, setFiltersState] = useState<TaskFiltersInput>({
    page: 1,
    limit: 10,
  })

  // Pagination metadata from backend
  const [pagination, setPagination] = useState<TasksResponse["pagination"]>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  })

  // Loading states for UX control
  const [isLoading, setIsLoading] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch task categories (used in filters dropdown)
  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategoriesRequest()
      setCategories(res)
    } catch (error) {
      const message = getErrorMessage(error)
      setError(message)
      toast.error("Error in fetching category Api" + message)
    }
  }, [])

  // Fetch paginated tasks with filters
  const fetchTasks = useCallback(
    async (
      next?: Partial<TaskFiltersInput>,
      options?: FetchOptions
    ): Promise<void> => {
      setError(null)

      // Optional silent mode (used for background refresh)
      if (!options?.silent) {
        setIsLoading(true)
      }

      try {
        // Merge current filters with new filters
        const merged = { ...filters, ...next }

        const res: TasksResponse = await getTasksRequest(merged)

        setTasks(res.tasks)
        setPagination(res.pagination)

        // Keep filters in sync with backend query
        setFiltersState(merged)
        return
      } catch (error) {
        const message = getErrorMessage(error)
        setError(message)
        toast.error("Error in fetch Api" + message)
        return
      } finally {
        if (!options?.silent) {
          setIsLoading(false)
        }
      }
    },
    [filters]
  )

  // Fetch single task details
  const getTaskById = useCallback(async (id: string) => {
    setError(null)
    setIsDetailLoading(true)

    try {
      const task = await getTaskByIdRequest(id)
      setSelectedTask(task)
    } catch (error) {
      const message = getErrorMessage(error)
      setError(message)
      toast.error("Error in get task Api" + message)
      setSelectedTask(null)
    } finally {
      setIsDetailLoading(false)
    }
  }, [])

  // Create new task
  const createTask = useCallback(
    async (payload: CreateTaskInput): Promise<boolean> => {
      setError(null)
      setIsSubmitting(true)

      try {
        await createTaskRequest(payload)

        toast.success("Task Created Successfully")

        // Refresh tasks + categories after creation
        await Promise.all([
          fetchTasks(undefined, { silent: true }),
          fetchCategories(),
        ])

        return true
      } catch (error) {
        const message = getErrorMessage(error)
        setError(message)
        toast.error("Error in Create Api" + message)
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [fetchTasks, fetchCategories]
  )

  // Update existing task
  const updateTask = useCallback(
    async (id: string, payload: UpdateTaskInput): Promise<boolean> => {
      setError(null)
      setIsSubmitting(true)

      try {
        const updated = await updateTaskRequest(id, payload)

        setSelectedTask(updated)

        toast.success("Task Updated Successfully")

        // Refresh list after update
        await fetchTasks(undefined, { silent: true })

        return true
      } catch (error) {
        const message = getErrorMessage(error)
        setError(message)
        toast.error("Error in Update Api" + message)
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [fetchTasks]
  )

  // Delete task (soft/hard depending on backend)
  const deleteTask = useCallback(
    async (id: string): Promise<boolean> => {
      setError(null)
      setIsSubmitting(true)

      try {
        await deleteTaskRequest(id)

        toast.success("Task Deleted Successfully")

        // Refresh list after delete
        await fetchTasks(undefined, { silent: true })

        return true
      } catch (error) {
        const message = getErrorMessage(error)
        setError(message)
        toast.error("Error in Delete Api" + message)
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [fetchTasks]
  )

  // Patch-based filter update (used by UI controls)
  const setFilters = useCallback((patch: Partial<TaskFiltersInput>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...patch,
    }))
  }, [])

  // Retry last failed fetch using current filters
  const retryFetchTasks = useCallback(() => {
    return fetchTasks(filters)
  }, [fetchTasks, filters])

  return {
    tasks,
    selectedTask,
    categories,
    filters,
    error,
    pagination,
    isLoading,
    isDetailLoading,
    isSubmitting,

    fetchTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    fetchCategories,
    setFilters,
    retryFetchTasks,
  }
}
