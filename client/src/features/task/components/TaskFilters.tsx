import { useEffect, useRef, useState } from "react"

import {
  TASK_PRIORITY,
  TASK_STATUS,
  type TaskFiltersInput,
  type TaskPriority,
  type TaskStatus,
} from "../task.schema"

import { useDebounce } from "@/shared/hooks/useDebounce"
import { Input } from "@/shared/resusable/Input"
import { Select } from "@/shared/resusable/Select"
import { Search } from "lucide-react"

interface Props {
  filters: TaskFiltersInput
  setFilters: (patch: Partial<TaskFiltersInput>) => void
  categories: string[]
  fetchTasks: (
    filters?: Partial<TaskFiltersInput>,
    options?: { silent?: boolean }
  ) => Promise<void>
}

// Fast lookup sets for validation (avoid invalid filter values)
const statusSet = new Set<TaskStatus>(TASK_STATUS)
const prioritySet = new Set<TaskPriority>(TASK_PRIORITY)

// Type guards to ensure only valid enum values are used
function isStatus(value: string): value is TaskStatus {
  return statusSet.has(value as TaskStatus)
}

function isPriority(value: string): value is TaskPriority {
  return prioritySet.has(value as TaskPriority)
}

export default function TaskFilters({
  filters,
  setFilters,
  categories,
  fetchTasks,
}: Props) {
  // Local search state (controlled input)
  const [search, setSearch] = useState<string>(filters.search || "")

  // Debounce search to avoid API calls on every keystroke
  const debouncedSearch = useDebounce(search)

  // Prevent API call on first render (initial hydration)
  const skipInitialSearchFetch = useRef(true)

  useEffect(() => {
    if (skipInitialSearchFetch.current) {
      skipInitialSearchFetch.current = false
      return
    }

    // Build updated filter with debounced search
    const updated: TaskFiltersInput = {
      ...filters,
      search: debouncedSearch || undefined,
      page: 1,
    }

    // Sync global filter state
    setFilters({
      search: debouncedSearch || undefined,
      page: 1,
    })

    // Fetch updated tasks
    fetchTasks(updated)
  }, [debouncedSearch])

  // Handles dropdown filter changes (status, priority, category)
  function handleFilterChange(key: keyof TaskFiltersInput, value: string) {
    let normalized: TaskFiltersInput[typeof key] | undefined

    // Validate enum values before applying filters
    if (key === "status") {
      normalized = isStatus(value) ? value : undefined
    } else if (key === "priority") {
      normalized = isPriority(value) ? value : undefined
    } else {
      normalized = value.trim() ? value : undefined
    }

    const updated: TaskFiltersInput = {
      ...filters,
      [key]: normalized,
      page: 1, // reset pagination on filter change
    }

    setFilters({
      [key]: normalized,
      page: 1,
    })

    fetchTasks(updated)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border-0 bg-white p-4">
      {/* Search input */}
      <div className="min-w-[220px] flex-1">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          leftIcon={<Search />}
        />
      </div>

      {/* Status filter */}
      <Select
        value={filters.status ?? ""}
        onChange={(e) => handleFilterChange("status", e.target.value)}
        options={[
          { label: "All Status", value: "" },
          ...TASK_STATUS.map((s) => ({
            label: s.replace("_", " "),
            value: s,
          })),
        ]}
      />

      {/* Priority filter */}
      <Select
        value={filters.priority ?? ""}
        onChange={(e) => handleFilterChange("priority", e.target.value)}
        options={[
          { label: "All Priority", value: "" },
          ...TASK_PRIORITY.map((p) => ({
            label: p,
            value: p,
          })),
        ]}
      />

      {/* Category filter */}
      <Select
        value={filters.category || ""}
        onChange={(e) => handleFilterChange("category", e.target.value)}
        options={[
          { label: "All Categories", value: "" },
          ...categories.map((c) => ({
            label: c,
            value: c,
          })),
        ]}
      />
    </div>
  )
}
