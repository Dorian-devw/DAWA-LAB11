export type Priority = 'Baja' | 'Media' | 'Alta' | 'Urgente'
export type Status = 'Pendiente' | 'En progreso' | 'Completado'

export interface TeamMember {
  userId: string
  role: string
  name: string
  email: string
  position?: string
  birthdate?: string
  phone?: string
  projectId?: string | null
  isActive: boolean
}

export interface Project {
  id: string
  name: string
  description?: string
  category?: string
  priority?: Priority | string
  members: string[] // array of userId
}

export interface Task {
  id: string
  description: string
  projectId: string
  status: Status
  priority: Priority | string
  userId?: string
  dateline?: string
}

export interface DashboardSettings {
  workspaceName: string
  emailNotifications: boolean
  pushNotifications: boolean
  maxActiveProjects: number
  defaultProjectView: 'Grid' | 'List' | 'Kanban'
}
