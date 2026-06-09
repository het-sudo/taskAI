import { useEffect, useRef, useState } from "react"

import { ChevronDown, LogOut } from "lucide-react"

import { useAuthStore } from "@/features/auth/auth.store"
import { useAuth } from "@/features/auth/useAuth"

export default function UserDropdown() {
  const user = useAuthStore((state) => state.user)

  const { logout } = useAuth()

  const [open, setOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const initial = user?.name?.charAt(0).toUpperCase() || "U"

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  function handleLogout() {
    logout()

    setOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-400 text-sm font-semibold text-white">
          {initial}
        </div>

        <div className="hidden text-left sm:block">
          <p className="max-w-[140px] truncate text-sm font-medium text-slate-800">
            {user?.name}
          </p>

          <p className="max-w-[160px] truncate text-xs text-slate-500">
            {user?.email}
          </p>
        </div>

        <ChevronDown
          className={`
            hidden h-4 w-4 text-slate-500 transition sm:block

            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-400 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />

            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}
