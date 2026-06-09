import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  iconClassName: string
  accentClassName: string
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  accentClassName,
}: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md ${accentClassName}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
