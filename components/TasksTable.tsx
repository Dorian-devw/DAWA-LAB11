"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useDashboard } from "./DashboardContext"
import { Pagination } from "./ui/pagination"

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado":
      return "default"
    case "En progreso":
      return "secondary"
    case "Pendiente":
      return "outline"
    default:
      return "outline"
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgente":
      return "destructive"
    case "Alta":
      return "default"
    case "Media":
      return "secondary"
    case "Baja":
      return "outline"
    default:
      return "outline"
  }
}

export function TasksTable() {
  const { tasks, deleteTask, updateTask } = useDashboard()
  const [page, setPage] = useState(1)
  const perPage = 5
  const totalPages = Math.max(1, Math.ceil(tasks.length / perPage))
  const start = (page - 1) * perPage
  const pageItems = tasks.slice(start, start + perPage)

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Lista de todas las tareas del proyecto</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>Tarea</TableHead>
            <TableHead>Proyecto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Asignado a</TableHead>
            <TableHead>Fecha límite</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">{task.description}</TableCell>
              <TableCell>{task.projectId}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
              </TableCell>
              <TableCell>{task.userId ?? '-'}</TableCell>
              <TableCell>{task.dateline ?? '-'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => updateTask(task.id, { status: task.status === 'Completado' ? 'Pendiente' : 'Completado' })}>
                  Toggle
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-4 flex justify-end">
        <Pagination page={page} totalPages={totalPages} onChange={(p) => setPage(p)} />
      </div>
    </div>
  )
}