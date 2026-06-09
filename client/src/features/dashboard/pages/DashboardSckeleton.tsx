export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* HERO */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="mt-4 h-8 w-72 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-96 rounded bg-slate-200" />

        <div className="mt-6 flex gap-3">
          <div className="h-10 w-28 rounded-xl bg-slate-200" />
          <div className="h-10 w-32 rounded-xl bg-slate-200" />
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="mt-3 h-6 w-10 rounded bg-slate-200" />
          </div>
        ))}
      </section>

      {/* CHARTS */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="h-40 rounded-2xl border bg-white p-6">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="mt-4 h-20 w-full bg-slate-200 rounded" />
        </div>

        <div className="lg:col-span-2 h-40 rounded-2xl border bg-white p-6">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="mt-4 h-20 w-full bg-slate-200 rounded" />
        </div>
      </section>

      {/* TASKS */}
      <section className="space-y-3">
        <div className="h-5 w-40 bg-slate-200 rounded" />

        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl border bg-white p-4">
            <div className="h-4 w-1/2 bg-slate-200 rounded" />
            <div className="mt-2 h-3 w-1/3 bg-slate-200 rounded" />
          </div>
        ))}
      </section>
    </div>
  )
}
