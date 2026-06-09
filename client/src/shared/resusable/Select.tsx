import type { SelectHTMLAttributes } from "react"

type Option = {
  label: string

  value: string
}

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
  helperText?: string
  options: Option[]
}

export function Select({
  className = "",
  label,
  error,
  helperText,
  options,
  disabled,
  ...props
}: Props) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <select
        disabled={disabled}
        className={`
          h-12 w-full rounded-2xl border bg-white px-4
          text-sm text-slate-800 outline-none
          transition-all duration-200

          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-slate-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          }

          disabled:cursor-not-allowed
          disabled:bg-slate-100
          disabled:text-slate-400
          disabled:opacity-70

          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-slate-500">{helperText}</p>
      ) : null}
    </div>
  )
}
