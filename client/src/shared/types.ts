//req res types
export type User = {
  id: string
  name: string
  email: string
}

export type ApiErrorResponse = {
  message: string
}

export type AuthResponse = {
  accessToken: string // error check
  user: User
}

export type AuthData = {
  user: User

  auth: {
    accessToken: string
  }
}
export type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data: T
}
