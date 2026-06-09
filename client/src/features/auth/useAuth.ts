import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  getMeRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
} from "./auth.api"
import { useAuthStore } from "./auth.store"
import type { LoginInput, RegisterInput } from "./auth.schema"

import {
  setAccessToken,
  removeAccessToken,
  getAccessToken,
} from "@/shared/token"
import { useCallback } from "react"
import { connectSocket, disconnectSocket, reconnectSocket } from "@/libs/socket"
import { getErrorMessage } from "@/libs/getErrorMessage"

// central auth hook handling login, register, logout, and session init
export function useAuth() {
  const navigate = useNavigate()
  const { setUser, clearUser, setLoading } = useAuthStore()

  // runs once on app load to restore session if token exists
  const initializeAuth = useCallback(async () => {
    const token = getAccessToken()

    // if no token, user is not authenticated
    if (!token) {
      clearUser()
      setLoading(false)
      return
    }

    // connect socket early so real-time events start working immediately
    connectSocket(token)

    try {
      const response = await getMeRequest()

      setUser(response)
    } catch {
      // invalid/expired token → clean up everything
      removeAccessToken()
      disconnectSocket()
      clearUser()
    } finally {
      setLoading(false)
    }
  }, [setUser, clearUser, setLoading])

  // login user and initialize session + socket
  async function login(data: LoginInput) {
    try {
      const response = await loginRequest(data)

      const token = response.accessToken

      // reset old token before setting new one
      removeAccessToken()
      setAccessToken(token)

      setUser(response.user)

      // reconnect socket with fresh token
      reconnectSocket(token)

      toast.success("Login successful")

      navigate("/dashboard", { replace: true })
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error("Error in login api: " + message)
    }
  }

  // register new user
  async function register(data: RegisterInput) {
    try {
      await registerRequest(data)

      toast.success("Account created")
      navigate("/", { replace: true })
      return true
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error("Error in register api: " + message)
    }
  }

  // logout user and clean all session state
  async function logout() {
    try {
      await logoutRequest()
    } finally {
      // always clear local session even if API fails
      clearUser()
      removeAccessToken()
      disconnectSocket()
      navigate("/", { replace: true })
    }
  }

  return {
    login,
    register,
    logout,
    initializeAuth,
  }
}
