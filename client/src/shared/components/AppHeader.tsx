import { Menu } from "lucide-react"

import UserDropdown from "./UserDropdown"
import NotificationBell from "@/features/notification/components/NotificationBell"

interface Props {
  onMenuClick: () => void
}

export default function AppHeader({ onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-slate-100 "
        >
          <Menu className="h-5 w-5 text-slate-700" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-400 text-sm font-semibold text-white shadow-sm">
            T
          </div>

          <div>
            <h1 className="text-lg font-semibold text-slate-900">TaskFlow</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <NotificationBell />

        <UserDropdown />
      </div>
    </header>
  )
}
