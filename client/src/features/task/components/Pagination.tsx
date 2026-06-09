import { Select } from "@/shared/resusable/Select"

interface Props {
  page: number
  totalPages: number
  limit: number

  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export default function Pagination({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: Props) {
  // If only 1 page exists, no pagination UI needed
  if (totalPages <= 1) {
    return null
  }

  // Generates smart pagination with ellipsis for large page sets
  function generatePages() {
    const pages: (number | string)[] = []

    // If pages are small, show all directly
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }

    // Always show first page
    pages.push(1)

    // Show left ellipsis if current page is far from start
    if (page > 3) {
      pages.push("...")
    }

    // Show pages around current page (current ±1)
    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Show right ellipsis if current page is far from end
    if (page < totalPages - 2) {
      pages.push("...")
    }

    // Always show last page
    pages.push(totalPages)

    return pages
  }

  return (
    <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Rows</span>

        <Select
          value={String(limit)}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="w-24"
          options={[5, 10, 20, 50].map((value) => ({
            label: String(value),
            value: String(value),
          }))}
        />
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* Previous page */}
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40"
        >
          Prev
        </button>

        {/* Page numbers */}
        {generatePages().map((item, index) =>
          item === "..." ? (
            <span key={`dots-${index}`} className="px-2 text-sm text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(Number(item))}
              className={`min-w-[36px] rounded-lg px-3 py-2 text-sm font-medium transition ${
                page === item
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item}
            </button>
          )
        )}

        {/* Next page */}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
