import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios"

import { getAccessToken, removeAccessToken, setAccessToken } from "./token"
import { reconnectSocket } from "@/libs/socket"

import { refreshRequest } from "@/features/auth/auth.api"

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

let refreshPromise: Promise<string> | null = null

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://13.203.215.191/api/v1",
  withCredentials: true,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig

    const status = error.response?.status

    const isRefreshRequest = originalRequest.url?.includes(
      "/auth/refresh-token"
    )

    if (isRefreshRequest) {
      return Promise.reject(error)
    }
    const url = originalRequest.url || ""

    const isAuthRoute =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh-token")

    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true

      try {
        if (!refreshPromise) {
          refreshPromise = refreshRequest()
            .then((res) => {
              setAccessToken(res.accessToken)
              reconnectSocket(res.accessToken)

              return res.accessToken
            })
            .finally(() => {
              refreshPromise = null
            })
        }

        const newToken = await refreshPromise

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }

        return api(originalRequest)
      } catch (err) {
        removeAccessToken()
        refreshPromise = null
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)
