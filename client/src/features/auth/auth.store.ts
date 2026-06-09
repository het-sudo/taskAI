import { create } from "zustand"
import type { User } from "@/shared/types"

// global auth state store (keeps user session across app)
type AuthState = {
  user: User | null

  isAuthenticated: boolean

  isLoading: boolean

  // set logged-in user and mark auth as true
  setUser: (user: User) => void

  // clear session on logout
  clearUser: () => void

  // control initial auth loading state (used during token check)
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isAuthenticated: false,

  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),
}))
