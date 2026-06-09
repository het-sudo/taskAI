import { useState } from "react"
import { LoginPage } from "./LoginPage"
import { RegisterPage } from "./RegisterPage"

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login")

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="hidden md:flex relative overflow-hidden bg-slate-100">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-red-100 blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-slate-200 blur-3xl opacity-50" />

        <div className="relative z-10 flex w-full flex-col justify-between px-16 py-14">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-red-500 flex items-center justify-center font-bold text-white shadow-sm">
              T
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                TaskFlow
              </h2>
              <p className="text-sm text-slate-500">
                Simple task management for teams
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight text-slate-900">
              Organize your work,
              <br />
              clear your mind
            </h1>

            <p className="text-lg text-slate-600 max-w-md">
              Plan tasks, track progress, and stay productive with a clean and
              focused workspace.
            </p>

            <div className="space-y-4 pt-4">
              {[
                "Simple task management",
                "Smart prioritization",
                "Team collaboration",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-slate-400">© 2026 TaskFlow</div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-slate-50 px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            <div className="mt-4 flex justify-center gap-6 text-sm">
              <button
                onClick={() => setMode("login")}
                className={
                  mode === "login"
                    ? "text-red-500 font-semibold"
                    : "text-gray-400"
                }
              >
                Login
              </button>

              <button
                onClick={() => setMode("register")}
                className={
                  mode === "register"
                    ? "text-red-500 font-semibold"
                    : "text-gray-400"
                }
              >
                Register
              </button>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            {mode === "login" ? (
              <LoginPage />
            ) : (
              <RegisterPage setMode={setMode} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
