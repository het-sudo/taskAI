import { useCallback, useEffect, useState } from "react"

import { toast } from "sonner"

import { listenSocket } from "@/libs/socket"
import { getErrorMessage } from "@/libs/getErrorMessage"
import type { Task } from "../task/task.schema"
import {
  getSharedCategoriesRequest,
  getSharedTasksRequest,
  shareTaskRequest,
} from "./api"
import type {
  SharedTask,
  SharedTasksResponse,
  TaskFiltersInput,
} from "./schema"

type FetchOptions = {
  silent?: boolean
}

export function useShareTask() {
  // List of shared tasks shown in UI
  const [tasks, setTasks] = useState<(Task & { sharedBy?: string })[]>([])

  // Available categories for filtering shared tasks
  const [categories, setCategories] = useState<string[]>([])

  // Global error state for UI feedback
  const [error, setError] = useState<string | null>(null)

  // Loading state for fetch operations
  const [isLoading, setIsLoading] = useState(false)

  // Loading state for share action (form submit)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Current filters applied on shared tasks list
  const [filters, setFiltersState] = useState<TaskFiltersInput>({
    page: 1,
    limit: 10,
  })

  // Pagination metadata from backend
  const [pagination, setPagination] = useState<
    SharedTasksResponse["pagination"]
  >({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  })

  // Fetch available categories for filter dropdown
  const fetchCategories = useCallback(async () => {
    try {
      const res = await getSharedCategoriesRequest()
      setCategories(res)
    } catch (error) {
      const message = getErrorMessage(error)
      setError(message)
      toast.error("Error in fetching categories " + message)
    }
  }, [])

  // Fetch shared tasks with optional filter overrides
  const fetchSharedTasks = useCallback(
    async (
      next?: Partial<TaskFiltersInput>,
      options?: FetchOptions
    ): Promise<void> => {
      setError(null)

      // skip loading spinner for silent updates (e.g. socket refresh)
      if (!options?.silent) {
        setIsLoading(true)
      }

      try {
        // merge current filters with incoming changes
        const merged = { ...filters, ...next }

        const res = await getSharedTasksRequest(merged)

        setTasks(res.tasks)
        setPagination(res.pagination)

        // keep filters in sync with backend request
        setFiltersState(merged)
      } catch (error) {
        const message = getErrorMessage(error)
        setError(message)
        toast.error("Error in fetching shared task api " + message)
      } finally {
        if (!options?.silent) {
          setIsLoading(false)
        }
      }
    },
    [filters]
  )

  // Update only part of filters (used by UI controls)
  const setFilters = useCallback((patch: Partial<TaskFiltersInput>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }))
  }, [])

  // Retry last failed request using current filters
  const retryFetchSharedTasks = useCallback(() => {
    return fetchSharedTasks(filters)
  }, [fetchSharedTasks, filters])

  // Share a task with another user via email
  const shareTask = useCallback(
    async (taskId: string, email: string): Promise<boolean> => {
      setIsSubmitting(true)

      try {
        await shareTaskRequest(taskId, email)
        toast.success("Task shared successfully")
        return true
      } catch (error) {
        const message = getErrorMessage(error)
        setError(message)
        toast.error("Error in retry shared task api " + message)
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    []
  )

  // Realtime update: refresh shared tasks when someone shares a task with user
  useEffect(() => {
    return listenSocket<SharedTask>("task:shared", () => {
      // silent refresh so UI doesn't show loading spinner
      fetchSharedTasks({ page: 1 }, { silent: true })
    })
  }, [fetchSharedTasks])

  return {
    tasks,
    categories,
    filters,
    error,
    pagination,
    isLoading,
    isSubmitting,
    fetchSharedTasks,
    fetchCategories,
    setFilters,
    retryFetchSharedTasks,
    shareTask,
  }
}
