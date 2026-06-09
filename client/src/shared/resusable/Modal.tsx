import type { ReactNode } from "react"

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
}

export function Modal({ open, onClose, title, children, size = "md" }: Props) {
  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`
          max-h-[90vh] w-full overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl
          ${sizeClasses[size]}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          </div>
        )}

        {children}
      </div>
    </div>
  )
}
