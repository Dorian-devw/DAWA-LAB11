"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TasksTable } from "@/components/TasksTable"

import { ProjectForm } from "@/components/ProjectForm"
import { DashboardProvider, useDashboard } from "@/components/DashboardContext"
import { useEffect } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import TaskForm from "@/components/TaskForm"

function ProjectDetails({ project }: { project: any }){
  const { team, deleteProject } = useDashboard()
  const members = project.members?.map((id: string) => team.find(t => t.userId === id)).filter(Boolean)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">Ver detalles</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          <div><strong>Categoría:</strong> {project.category}</div>
          <div><strong>Prioridad:</strong> {project.priority}</div>
          <div>
            <strong>Miembros asignados:</strong>
            <ul className="list-disc pl-5">
              {members && members.length > 0 ? members.map((m: any) => <li key={m.userId}>{m.name} — {m.role}</li>) : <li>No hay miembros</li>}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => { if(confirm('Eliminar proyecto? Esto eliminará tareas asociadas y desasignará miembros.')){ deleteProject(project.id) } }}>
            Eliminar proyecto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
import { Calendar } from "@/components/ui/calendar"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { useState } from "react"

function TeamManager(){
  const { team, addTeamMember, deleteTeamMember } = useDashboard()
  const [form, setForm] = useState({ name: '', role: '', email: '', position: '', birthdate: '', phone: '', projectId: undefined, isActive: true })

  return (
    <div className="space-y-4">
      <form className="grid grid-cols-1 md:grid-cols-3 gap-2" onSubmit={(e)=>{e.preventDefault(); addTeamMember(form); setForm({ name: '', role: '', email: '', position: '', birthdate: '', phone: '', projectId: undefined, isActive: true })}}>
        <input required placeholder="Nombre" value={form.name} onChange={(e)=>setForm(s=>({...s, name: e.target.value}))} className="border px-2 py-1" />
        <input placeholder="Rol" value={form.role} onChange={(e)=>setForm(s=>({...s, role: e.target.value}))} className="border px-2 py-1" />
        <input type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm(s=>({...s, email: e.target.value}))} className="border px-2 py-1" />
        <input placeholder="Posición" value={form.position} onChange={(e)=>setForm(s=>({...s, position: e.target.value}))} className="border px-2 py-1" />
        <Calendar value={form.birthdate} onChange={(v)=>setForm(s=>({...s, birthdate: v}))} />
        <input placeholder="Teléfono" value={form.phone} onChange={(e)=>setForm(s=>({...s, phone: e.target.value}))} className="border px-2 py-1" />
        <div className="md:col-span-3 flex gap-2">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e)=>setForm(s=>({...s, isActive: e.target.checked}))} /> Activo</label>
          <button className="px-3 py-1 bg-slate-800 text-white rounded">Crear miembro</button>
        </div>
      </form>

      <div className="space-y-2">
        {team.length === 0 && <div className="text-sm text-muted-foreground">No hay miembros</div>}
        {team.map(m=> (
          <div key={m.userId} className="flex items-center justify-between p-3 border rounded">
            <div>
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-muted-foreground">{m.role} — {m.email}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-2 py-1 border rounded" onClick={()=>deleteTeamMember(m.userId)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsManager(){
  const { settings, saveSettings } = useDashboard()
  const [form, setForm] = useState(settings)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await saveSettings(form)
    setLoading(false)
    setSaved(true)
    setTimeout(()=>setSaved(false), 2000)
  }

  return (
    <form className="space-y-4" onSubmit={handleSave}>
      <div className="grid gap-2">
        <label>Workspace Name</label>
        <input className="border px-2 py-1" value={form.workspaceName} onChange={(e)=>setForm(s=>({...s, workspaceName: e.target.value}))} />
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.emailNotifications} onChange={(e)=>setForm(s=>({...s, emailNotifications: e.target.checked}))} /> Email Notifications</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.pushNotifications} onChange={(e)=>setForm(s=>({...s, pushNotifications: e.target.checked}))} /> Push Notifications</label>
      </div>
      <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
        <div>
          <label>Maximum Active Projects</label>
          <input type="number" className="border px-2 py-1 w-full" value={form.maxActiveProjects} onChange={(e)=>setForm(s=>({...s, maxActiveProjects: Number(e.target.value)}))} />
        </div>
        <div>
          <label>Default Project View</label>
          <select className="border px-2 py-1 w-full" value={form.defaultProjectView} onChange={(e)=>setForm(s=>({...s, defaultProjectView: e.target.value as any}))}>
            <option>Grid</option>
            <option>List</option>
            <option>Kanban</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 bg-slate-800 text-white rounded" disabled={loading}>{loading ? <Spinner /> : 'Guardar Configuración'}</button>
        {saved && <Alert title="Guardado" description="Configuración guardada en memoria" variant="success" />}
      </div>
    </form>
  )
}

function DashboardContent(){
  const { projects, tasks, team } = useDashboard()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Dashboard de Proyectos
          </h1>
          <p className="text-slate-600">
            Gestiona tus proyectos y tareas con shadcn/ui
          </p>
          <div className="pt-4">
             <ProjectForm />
          </div>

        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
          </TabsList>

          {/* Tab: Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Stat Cards */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Proyectos
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{projects.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {projects.length > 0 ? `+${Math.max(0, Math.round(projects.length * 0.1))} desde el mes pasado` : 'Sin proyectos'}
                    </p>
                  </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tareas Completadas
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'Completado').length}</div>
                  <p className="text-xs text-muted-foreground">
                    {tasks.length > 0 ? `${Math.round((tasks.filter(t => t.status === 'Completado').length / tasks.length) * 100)}% completadas` : 'Sin tareas'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Horas Trabajadas
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(tasks.length * 2) + 'h'}</div>
                  <p className="text-xs text-muted-foreground">
                    Estimado de horas basado en tareas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Miembros Activos
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{team.filter(m => m.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">
                    {team.length > 0 ? `${team.length - team.filter(m => !m.isActive).length} activos` : 'Sin miembros'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimas actualizaciones de tus proyectos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: "María García", action: "completó la tarea", task: "Diseño de UI", time: "Hace 5 min" },
                    { user: "Juan Pérez", action: "comentó en", task: "API Backend", time: "Hace 1 hora" },
                    { user: "Ana López", action: "creó un nuevo", task: "Proyecto Mobile", time: "Hace 2 horas" },
                    { user: "Carlos Ruiz", action: "actualizó", task: "Documentación", time: "Hace 3 horas" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{activity.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.user}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.action} <span className="font-medium">{activity.task}</span>
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Projects */}
          <TabsContent value="projects" className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-sm text-muted-foreground">No hay proyectos</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Badge variant={project.priority === 'Alta' || project.priority === 'Urgente' ? 'destructive' : 'default'}>
                        {project.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                          </svg>
                          {project.members.length} miembros
                        </div>
                        <div className="flex gap-2">
                          <ProjectDetails project={project} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Team */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Miembros del Equipo</CardTitle>
                <CardDescription>
                  Gestiona los miembros de tu equipo y sus roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamManager />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>
                  Administra las preferencias de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SettingsManager />
              </CardContent>
            </Card>
          </TabsContent>

            {/* // Agregar nuevo TabsContent: */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Tareas</CardTitle>
                <CardDescription>
                  Administra todas las tareas de tus proyectos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskForm />
                <TasksTable />
              </CardContent>
            </Card>
          </TabsContent>

          
        </Tabs>
      </div>
    </div>
  )
}

export default function DashboardPage(){
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  )
}

