"use client"
import React from 'react'

type CalendarProps = {
  value?: string
  onChange?: (v: string) => void
}

export function Calendar({ value, onChange }: CalendarProps) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="border rounded px-2 py-1"
    />
  )
}

export default Calendar
