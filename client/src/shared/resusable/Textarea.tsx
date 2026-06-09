import { forwardRef, type TextareaHTMLAttributes } from "react"

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className = "", label, error, helperText, disabled, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          disabled={disabled}
          className={`
              min-h-[120px] w-full rounded-2xl border bg-white px-4 py-3
              text-sm leading-6 text-slate-800 outline-none
              transition-all duration-200 resize-none

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
        />

        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : helperText ? (
          <p className="text-sm text-slate-500">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"
