import React from 'react'

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex items-center gap-2">
      <button className="px-2 py-1 border rounded" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      {pages.map((p) => (
        <button key={p} className={`px-2 py-1 border rounded ${p === page ? 'bg-slate-200' : ''}`} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
      <button className="px-2 py-1 border rounded" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  )
}

export default Pagination
