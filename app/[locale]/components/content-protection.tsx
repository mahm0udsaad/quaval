"use client"

import { useEffect } from "react"

export default function ContentProtection() {
  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => event.preventDefault()
    const preventImageDrag = (event: DragEvent) => {
      if (event.target instanceof HTMLImageElement || event.target instanceof HTMLCanvasElement) event.preventDefault()
    }
    const preventSaveOrPrint = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && ["p", "s"].includes(event.key.toLowerCase())) event.preventDefault()
    }

    document.addEventListener("contextmenu", preventContextMenu)
    document.addEventListener("dragstart", preventImageDrag)
    window.addEventListener("keydown", preventSaveOrPrint)

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu)
      document.removeEventListener("dragstart", preventImageDrag)
      window.removeEventListener("keydown", preventSaveOrPrint)
    }
  }, [])

  return null
}
