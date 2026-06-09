import { Navigate, Outlet } from "react-router-dom"

import { useAuthStore } from "@/features/auth/auth.store"
import { AppLoader } from "@/shared/AppLoader"

//protecting route from unauthenticate access

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const isLoading = useAuthStore((state) => state.isLoading)

  if (isLoading) {
    return <AppLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to={"/"} replace />
  }

  return <Outlet />
}
