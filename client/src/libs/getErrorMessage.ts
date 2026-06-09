import type { AxiosError } from "axios"
import type { ApiErrorResponse } from "@/shared/types"

export function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>

  return axiosError.response?.data?.message || "Something went wrong"
}
