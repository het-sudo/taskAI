import { useState } from "react"
import { Outlet } from "react-router-dom"
import AppHeader from "./components/AppHeader"
import AppSidebar from "./components/AppSidebar"

export function AppLayout() {
  const [openSidebar, setOpenSidebar] = useState(false)

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-red-400">
      <AppHeader onMenuClick={() => setOpenSidebar((prev) => !prev)} />

      <AppSidebar open={openSidebar} onClose={() => setOpenSidebar(false)} />

      <main
        className={`min-h-[calc(100vh-72px)] flex-1 p-4 transition-[margin-left] duration-300 ease-in-out md:p-8 ${
          openSidebar ? "md:ml-72" : "md:ml-0"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
