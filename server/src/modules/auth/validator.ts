import { z } from "zod"

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name too long"),

    email: z.string().trim().email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .transform(({ confirmPassword, ...data }) => data)

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),

  password: z.string().min(8, "Password is required"),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token required"),
})

export const logoutSchema = z.object({
  accessToken: z.string().min(1, "Access token required"),

  refreshToken: z.string().min(1, "Refresh token required"),
})

export const JwtPayloadSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  jti: z.string(),
})

export type JwtPayload = z.infer<typeof JwtPayloadSchema>

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RefreshInput = z.infer<typeof refreshSchema>
export type LogoutInput = z.infer<typeof logoutSchema>
