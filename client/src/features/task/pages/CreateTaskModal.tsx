import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  createTaskSchema,
  type CreateTaskInput,
  TASK_PRIORITY,
  TASK_STATUS,
} from "../task.schema"

import {
  X,
  PlusCircle,
  FileText,
  Tag,
  Calendar,
  XCircle,
  CheckCircle,
} from "lucide-react"

import { Input } from "@/shared/resusable/Input"
import { Textarea } from "@/shared/resusable/Textarea"
import { Select } from "@/shared/resusable/Select"
import { Button } from "@/shared/resusable/Button"
import { Modal } from "@/shared/resusable/Modal"

import { useTask } from "../useTask"

interface Props {
  open: boolean
  onClose: () => void
  tasks: ReturnType<typeof useTask>
}

export default function CreateTaskModal({ open, onClose, tasks }: Props) {
  const { createTask } = tasks

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: "MEDIUM",
      status: "TODO",
    },
  })

  async function onSubmit(values: CreateTaskInput) {
    const ok = await createTask({
      ...values,
      dueDate: values.dueDate
        ? new Date(values.dueDate).toISOString()
        : undefined,
    })

    if (!ok) return
    reset()
    onClose()
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <div className="mb-6 flex items-center justify-between ">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <PlusCircle className="h-5 w-5 text-red-400" />
            Create Task
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add a new task to your workspace.
          </p>
        </div>

        <button
          onClick={handleClose}
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
            <FileText className="h-4 w-4 text-slate-500" />
            Title
          </label>

          <Input
            type="text"
            placeholder="Enter task title"
            error={errors.title?.message}
            {...register("title")}
          />
        </div>

        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
            <FileText className="h-4 w-4 text-slate-500" />
            Description
          </label>

          <Textarea
            rows={5}
            placeholder="Enter Your Description"
            error={errors.description?.message}
            {...register("description")}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Tag className="h-4 w-4 text-slate-500" />
              Category
            </label>

            <Input
              type="text"
              placeholder="Work"
              error={errors.category?.message}
              {...register("category")}
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Calendar className="h-4 w-4 text-slate-500" />
              Due Date
            </label>

            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              error={errors.dueDate?.message}
              {...register("dueDate")}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Priority"
            options={TASK_PRIORITY.map((p) => ({
              label: p,
              value: p,
            }))}
            {...register("priority")}
          />

          <Select
            label="Status"
            options={TASK_STATUS.map((s) => ({
              label: s.replace("_", " "),
              value: s,
            }))}
            {...register("status")}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>

          <Button type="submit" loading={isSubmitting}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  )
}
