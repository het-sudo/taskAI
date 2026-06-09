type Props = {
  inline?: boolean
}

export function AppLoader({ inline = false }: Props) {
  return (
    <div
      className={
        inline
          ? "flex items-center justify-center py-12"
          : "flex min-h-screen items-center justify-center bg-slate-50"
      }
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
    </div>
  )
}
