"use client"

import React, { useState } from "react"
import { useDashboard } from "./DashboardContext"
import { Calendar } from "./ui/calendar"

export function TaskForm(){
  const { projects, team, addTask } = useDashboard()
  const [form, setForm] = useState({ description: '', projectId: projects[0]?.id ?? '', status: 'Pendiente', priority: 'Media', userId: team[0]?.userId ?? '', dateline: '' })

  const handleSubmit = (e: React.FormEvent) =>{
    e.preventDefault()
    if(!form.projectId) return alert('Selecciona un proyecto')
    addTask({ description: form.description, projectId: form.projectId, status: form.status as any, priority: form.priority as any, userId: form.userId || undefined, dateline: form.dateline || undefined })
    setForm({ description: '', projectId: projects[0]?.id ?? '', status: 'Pendiente', priority: 'Media', userId: team[0]?.userId ?? '', dateline: '' })
  }

  return (
    <form className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2" onSubmit={handleSubmit}>
      <input placeholder="Descripción" required value={form.description} onChange={(e)=>setForm(s=>({...s, description: e.target.value}))} className="border px-2 py-1 md:col-span-2" />
      <select value={form.projectId} onChange={(e)=>setForm(s=>({...s, projectId: e.target.value}))} className="border px-2 py-1">
        <option value="">Selecciona proyecto</option>
        {projects.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <select value={form.userId} onChange={(e)=>setForm(s=>({...s, userId: e.target.value}))} className="border px-2 py-1">
        <option value="">Asignar a</option>
        {team.map(t=> <option key={t.userId} value={t.userId}>{t.name}</option>)}
      </select>
      <select value={form.status} onChange={(e)=>setForm(s=>({...s, status: e.target.value}))} className="border px-2 py-1">
        <option>Pendiente</option>
        <option>En progreso</option>
        <option>Completado</option>
      </select>
      <select value={form.priority} onChange={(e)=>setForm(s=>({...s, priority: e.target.value}))} className="border px-2 py-1">
        <option>Media</option>
        <option>Baja</option>
        <option>Alta</option>
        <option>Urgente</option>
      </select>
      <Calendar value={form.dateline} onChange={(v)=>setForm(s=>({...s, dateline: v}))} />
      <button className="px-3 py-1 bg-indigo-600 text-white rounded">Crear tarea</button>
    </form>
  )
}

export default TaskForm
