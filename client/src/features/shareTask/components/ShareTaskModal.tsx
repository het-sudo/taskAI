import { useState } from "react"

import { Input } from "@/shared/resusable/Input"

import { Button } from "@/shared/resusable/Button"

import { useShareTask } from "../useShare"
import { Search } from "lucide-react"

type Props = {
  taskId: string
  onClose: () => void
}

export default function ShareTaskModal({ taskId, onClose }: Props) {
  const [email, setEmail] = useState("")

  const { shareTask, isSubmitting } = useShareTask()

  async function handleSubmit() {
    if (!email.trim()) {
      return
    }

    const ok = await shareTask(taskId, email)

    if (ok) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900">Share Task</h2>

          <p className="text-sm text-slate-500">
            Share this task with another user.
          </p>
        </div>

        <div className="mt-5">
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Search />}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose}>Cancel</Button>

          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Sharing..." : "Share"}
          </Button>
        </div>
      </div>
    </div>
  )
}
