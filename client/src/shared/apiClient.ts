import type { ApiResponse } from "@/shared/types"

export async function request<T>(
  promise: Promise<{ data: ApiResponse<T> }>
): Promise<T> {
  const response = await promise
  return response.data.data
}
