import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/shared/resusable/Button"
import { Input } from "@/shared/resusable/Input"

import { registerSchema, type RegisterInput } from "../auth.schema"

import { useAuth } from "../useAuth"

import { Lock, Mail, User } from "lucide-react"

interface RegisterPageProps {
  setMode: React.Dispatch<React.SetStateAction<"login" | "register">>
}

export function RegisterPage({ setMode }: RegisterPageProps) {
  const { register: registerUser } = useAuth()
  const onSubmit = async (data: RegisterInput) => {
    const success = await registerUser(data)

    if (success) {
      setMode("login")
    }
  }
  const {
    register,

    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-red-400">Create Account</h1>

        <p className="mt-2 text-sm text-slate-700">
          Register to start managing tasks
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full Name"
          placeholder="Enter your Full Name"
          className="pl-10"
          error={errors.name?.message}
          leftIcon={<User className="h-5 w-5" />}
          {...register("name")}
        />

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
        <Input
          type={"password"}
          label="Confirm Password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          leftIcon={<Lock className="h-5 w-5" />}
          enablePasswordToggle
          {...register("confirmPassword")}
        />
        <Button type="submit" loading={isSubmitting} fullWidth>
          Register
        </Button>
      </form>
    </>
  )
}
