import { api } from "@/shared/axios"
import { request } from "@/shared/apiClient"

import type { LoginInput, RegisterInput } from "./auth.schema"

import type { AuthData, User } from "@/shared/types"

export async function loginRequest(data: LoginInput) {
  const result = await request<AuthData>(api.post("/auth/login", data))

  return {
    user: result.user,
    accessToken: result.auth.accessToken,
  }
}

export async function registerRequest(data: RegisterInput) {
  return request<User>(api.post("/auth/register", data))
}

export async function getMeRequest() {
  return request<User>(api.get("/auth/me"))
}

export async function refreshRequest() {
  const result = await request<AuthData>(api.post("/auth/refresh-token"))

  return {
    user: result.user,
    accessToken: result.auth.accessToken,
  }
}

export async function logoutRequest() {
  await api.post("/auth/logout")
}
