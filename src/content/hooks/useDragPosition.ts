import { useState, useRef, useEffect, useCallback } from 'react'

const BUTTON_SIZE = 50
const STORAGE_KEY = 'light_button_pos'
const DRAG_THRESHOLD = 3

interface Position {
  x: number
  y: number
}

function clamp(pos: Position): Position {
  return {
    x: Math.max(0, Math.min(window.innerWidth - BUTTON_SIZE, pos.x)),
    y: Math.max(0, Math.min(window.innerHeight - BUTTON_SIZE, pos.y)),
  }
}

function defaultPos(): Position {
  return {
    x: window.innerWidth - BUTTON_SIZE - 24,
    y: window.innerHeight - BUTTON_SIZE - 24,
  }
}

export function useDragPosition() {
  const [pos, setPos] = useState<Position>(defaultPos)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef<{ mouseX: number; mouseY: number; posX: number; posY: number } | null>(null)
  const hasMoved = useRef(false)
  const lastPos = useRef(pos)

  useEffect(() => {
    chrome.storage.local.get(STORAGE_KEY).then(result => {
      const saved = result[STORAGE_KEY] as Position | undefined
      if (saved) {
        const clamped = clamp(saved)
        setPos(clamped)
        lastPos.current = clamped
      }
    })
  }, [])

  useEffect(() => {
    const onResize = () =>
      setPos(prev => {
        const clamped = clamp(prev)
        lastPos.current = clamped
        return clamped
      })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const onMouseMove = (e: MouseEvent) => {
      if (!dragStart.current) return
      const dx = e.clientX - dragStart.current.mouseX
      const dy = e.clientY - dragStart.current.mouseY
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        hasMoved.current = true
      }
      const newPos = clamp({
        x: dragStart.current.posX + dx,
        y: dragStart.current.posY + dy,
      })
      lastPos.current = newPos
      setPos(newPos)
    }

    const onMouseUp = () => {
      setIsDragging(false)
      dragStart.current = null
      void chrome.storage.local.set({ [STORAGE_KEY]: lastPos.current })
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    hasMoved.current = false
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: lastPos.current.x,
      posY: lastPos.current.y,
    }
    setIsDragging(true)
  }, [])

  return { pos, isDragging, hasMoved, onMouseDown }
}
