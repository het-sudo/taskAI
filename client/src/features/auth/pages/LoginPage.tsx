import { Lock, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/shared/resusable/Button"
import { Input } from "@/shared/resusable/Input"

import { loginSchema, type LoginInput } from "../auth.schema"
import { useAuth } from "../useAuth"

export function LoginPage() {
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>

        <p className="mt-2 text-sm text-slate-500">
          Login to continue to your workspace
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(login)}>
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          error={errors.email?.message}
          leftIcon={<Mail className="h-5 w-5" />}
          {...register("email")}
        />

        <Input
          type={"password"}
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          leftIcon={<Lock className="h-5 w-5" />}
          enablePasswordToggle
          {...register("password")}
        />

        <Button type="submit" loading={isSubmitting} fullWidth>
          Login
        </Button>
      </form>
    </>
  )
}
