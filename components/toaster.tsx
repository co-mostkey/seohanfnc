"use client"

import { useState, useEffect } from "react"

interface Toast {
  id: string
  title: string
  description?: string
  type: "default" | "success" | "error"
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handleToast = (event: CustomEvent<Toast>) => {
      setToasts((prev) => [...prev, event.detail])
    }

    window.addEventListener("toast" as any, handleToast as any)
    return () => window.removeEventListener("toast" as any, handleToast as any)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 m-8 flex flex-col items-end space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex w-96 items-center justify-between rounded-lg p-4 shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-green-100 text-green-800"
              : toast.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-white text-gray-800"
          }`}
        >
          <div>
            <h3 className="font-medium">{toast.title}</h3>
            {toast.description && <p className="mt-1 text-sm">{toast.description}</p>}
          </div>
          <button onClick={() => removeToast(toast.id)} className="ml-4 text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

