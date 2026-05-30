"use client"

import React, { createContext, useContext, useState } from "react"
import { Project, TeamMember, Task, DashboardSettings } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

type DashboardContextType = {
  projects: Project[]
  team: TeamMember[]
  tasks: Task[]
  settings: DashboardSettings
  addProject: (p: Omit<Project, 'id' | 'members'> & { members?: string[] }) => void
  deleteProject: (id: string) => void
  addTeamMember: (m: Omit<TeamMember, 'userId'>) => void
  updateTeamMember: (userId: string, patch: Partial<TeamMember>) => void
  deleteTeamMember: (userId: string) => void
  addTask: (t: Omit<Task, 'id'>) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  deleteTask: (id: string) => void
  saveSettings: (s: DashboardSettings) => Promise<void>
}

const defaultSettings: DashboardSettings = {
  workspaceName: "Mi Workspace",
  emailNotifications: true,
  pushNotifications: false,
  maxActiveProjects: 10,
  defaultProjectView: 'List',
}

// Datos por defecto para mostrar la UI ocupada en cero-config
const sampleTeam: TeamMember[] = [
  { userId: 'u1', name: 'María García', role: 'Product Manager', email: 'maria@example.com', isActive: true, projectId: 'p1' },
  { userId: 'u2', name: 'Juan Pérez', role: 'Developer', email: 'juan@example.com', isActive: true, projectId: 'p1' },
  { userId: 'u3', name: 'Ana López', role: 'Designer', email: 'ana@example.com', isActive: false, projectId: null },
]

const sampleProjects: Project[] = [
  { id: 'p1', name: 'Proyecto ejemplo', description: 'Proyecto inicial para demo', category: 'web', priority: 'Media', members: ['u1', 'u2'] },
  { id: 'p2', name: 'Proyecto secundario', description: 'Otro proyecto de prueba', category: 'design', priority: 'Baja', members: [] },
]

const sampleTasks: Task[] = [
  { id: 't1', description: 'Diseñar landing', projectId: 'p1', status: 'Pendiente', priority: 'Media', userId: 'u3' },
  { id: 't2', description: 'Implementar API', projectId: 'p1', status: 'En progreso', priority: 'Alta', userId: 'u2' },
]

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [team, setTeam] = useState<TeamMember[]>(sampleTeam)
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [settings, setSettings] = useState<DashboardSettings>(defaultSettings)

  const addProject = (p: Omit<Project, 'id' | 'members'> & { members?: string[] }) => {
    const newProject: Project = {
      id: uuidv4(),
      members: p.members ?? [],
      name: p.name,
      description: p.description,
      category: p.category,
      priority: p.priority,
    }
    setProjects((s) => [newProject, ...s])
  }

  const deleteProject = (id: string) => {
    // remove project and warn: also orphan tasks and detach members
    setTasks((t) => t.filter((task) => task.projectId !== id))
    setTeam((m) => m.map((mm) => (mm.projectId === id ? { ...mm, projectId: null } : mm)))
    setProjects((p) => p.filter((pr) => pr.id !== id))
  }

  const addTeamMember = (m: Omit<TeamMember, 'userId'>) => {
    const newMember: TeamMember = { ...m, userId: uuidv4() }
    setTeam((s) => [newMember, ...s])
  }

  const updateTeamMember = (userId: string, patch: Partial<TeamMember>) => {
    setTeam((s) => s.map((m) => (m.userId === userId ? { ...m, ...patch } : m)))
  }

  const deleteTeamMember = (userId: string) => {
    setTasks((t) => t.map((task) => (task.userId === userId ? { ...task, userId: undefined } : task)))
    setTeam((s) => s.filter((m) => m.userId !== userId))
  }

  const addTask = (t: Omit<Task, 'id'>) => {
    const newTask: Task = { ...t, id: uuidv4() }
    setTasks((s) => [newTask, ...s])
  }

  const updateTask = (id: string, patch: Partial<Task>) => {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }

  const deleteTask = (id: string) => setTasks((s) => s.filter((t) => t.id !== id))

  const saveSettings = async (s: DashboardSettings) => {
    // simulate latency
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setSettings(s)
        resolve()
      }, 800)
    })
  }

  return (
    <DashboardContext.Provider
      value={{
        projects,
        team,
        tasks,
        settings,
        addProject,
        deleteProject,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        addTask,
        updateTask,
        deleteTask,
        saveSettings,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider")
  return ctx
}
