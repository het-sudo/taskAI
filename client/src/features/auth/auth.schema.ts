import { z } from "zod"

//zod schema and ts input type

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z.string().min(2, "Minimum 2 characters"),

    email: z.email("Invalid email"),

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

export type RegisterInput = z.infer<typeof registerSchema>
