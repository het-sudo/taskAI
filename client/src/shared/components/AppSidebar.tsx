import { NavLink } from "react-router-dom"

import { CheckSquare, Users, X, LayoutDashboard } from "lucide-react"

interface Props {
  open: boolean

  onClose: () => void
}

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",

    icon: LayoutDashboard,
  },
  {
    label: "My Tasks",
    path: "/tasks",
    icon: CheckSquare,
  },

  {
    label: "Shared Tasks",
    path: "/shared",

    icon: Users,
  },
]

export default function AppSidebar({
  open,

  onClose,
}: Props) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-[72px] z-50 flex h-[calc(100dvh-72px)] w-72 flex-col border-r border-slate-200 bg-[#fcfaf8] p-5 transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between md:hidden">
          <h2 className="text-lg font-semibold text-slate-900">Menu</h2>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.matchMedia("(max-width: 767px)").matches) {
                    onClose()
                  }
                }}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3 rounded-2xl px-4 py-3
                    text-sm font-medium transition-all duration-200

                    ${
                      isActive
                        ? "bg-red-400 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }
                  `
                }
              >
                <Icon className="h-5 w-5" />

                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
