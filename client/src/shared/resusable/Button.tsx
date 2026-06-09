import type { ButtonHTMLAttributes, ReactNode } from "react"

type Variant = "primary" | "secondary" | "danger" | "ghost"

type Size = "sm" | "md" | "lg"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  fullWidth?: boolean
  variant?: Variant
  size?: Size
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-red-400 text-white hover:bg-red-500",
  secondary: "border border-red-200 bg-white text-red-300 hover:bg-red-100",
  danger: "bg-red-500 text-white hover:bg-red-600",

  ghost: "bg-transparent text-red-500 hover:bg-red-100",
}

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
}

export function Button({
  className = "",
  loading = false,
  fullWidth = false,
  variant = "primary",
  size = "md",
  children,
  disabled,
  ...props
}: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        rounded-xl
        font-medium
        transition-all duration-200
        disabled:cursor-not-allowed
        disabled:opacity-60

        ${variantClasses[variant]}
        ${sizeClasses[size]}

        ${fullWidth ? "w-full" : ""}

        ${className}
      `}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  )
}
