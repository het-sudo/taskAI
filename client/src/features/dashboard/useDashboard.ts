import { useCallback, useEffect, useState } from "react"
import { listenSocket } from "@/libs/socket"
import { getSharedTasksRequest } from "@/features/shareTask/api"
import type { Task } from "@/features/task/task.schema"
import { getDashboardRequest } from "./api"
import type { DashboardResponse } from "./schema"
import { getErrorMessage } from "@/libs/getErrorMessage"
import { toast } from "sonner"

// central dashboard state + data fetching logic
export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null)

  const [recentSharedTasks, setRecentSharedTasks] = useState<
    (Task & { sharedBy?: string; isOverdue?: boolean })[]
  >([])

  const [loading, setLoading] = useState<boolean>(true)

  const [error, setError] = useState<string | null>(null)

  // fetch only shared tasks (used for sidebar/preview section)
  const fetchRecentSharedTasks = useCallback(async () => {
    setError(null)

    try {
      const res = await getSharedTasksRequest({ page: 1, limit: 5 })
      setRecentSharedTasks(res.tasks)
    } catch (error) {
      const message = getErrorMessage(error)

      setError(message)
      toast.error("Error in backend fetch api: " + message)

      // fallback empty state on failure
      setRecentSharedTasks([])
    }
  }, [])

  // fetch full dashboard stats + recent data
  const fetchDashboard = useCallback(
    async (showLoading = true) => {
      setError(null)

      try {
        if (showLoading) setLoading(true)

        const res = await getDashboardRequest()

        setData(res)

        // fetch secondary UI data after main dashboard loads
        await fetchRecentSharedTasks()
      } catch (error) {
        const message = getErrorMessage(error)

        setError(message)
        toast.error("Error in dashboard api: " + message)

        setData(null)
      } finally {
        if (showLoading) setLoading(false)
      }
    },
    [fetchRecentSharedTasks]
  )

  // initial dashboard load on mount
  useEffect(() => {
    const load = async () => {
      await fetchDashboard()
    }

    load()
  }, [fetchDashboard])

  // real-time update: refresh dashboard when task is shared
  useEffect(() => {
    return listenSocket("task:shared", () => fetchDashboard(false))
  }, [fetchDashboard])

  return { data, loading, recentSharedTasks, error }
}
