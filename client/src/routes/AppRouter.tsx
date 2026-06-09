import { Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "./ProtectedRoute"
import { AppLayout } from "@/shared/AppLayout"

import NotFoundPage from "@/components/NotFoundPage"
import TaskDetail from "@/features/task/pages/TaskDetail"
import SharedTasksPage from "@/features/shareTask/pages/ShareTaskPage"
import DashboardPage from "@/features/dashboard/pages/DashboardPage"
import TaskPage from "@/features/task/pages/TaskPage"
import AuthPage from "@/features/auth/pages/AuthPage"

// App router for routes
export function AppRouter() {
  return (
    <Routes>
      <Route path={"/"} element={<AuthPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={"/dashboard"} element={<DashboardPage />} />

          <Route path="/tasks" element={<TaskPage />} />

          <Route path="/tasks/:id" element={<TaskDetail />} />

          <Route path="/shared" element={<SharedTasksPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
