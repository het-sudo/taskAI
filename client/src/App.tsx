import { useEffect } from "react"
import { AppRouter } from "@/routes/AppRouter"
import { useAuth } from "@/features/auth/useAuth"

function App() {
  const { initializeAuth } = useAuth()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return <AppRouter />
}

export default App
