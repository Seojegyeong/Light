import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { Term } from '@/types/term'
import { termService } from '@/services/termService'
import { TermTooltip } from './TermTooltip'
import { useSettings } from '../context/SettingsContext'

interface TooltipState {
  term: Term
  anchorRect: DOMRect
}

export function TooltipLayer(): React.ReactElement {
  const { settings } = useSettings()
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleMouseOver = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element
      const span = target.closest('[data-light]') as HTMLElement | null
      if (!span) return

      const termKey = span.getAttribute('data-light') ?? ''
      const term = termService.match(termKey)
      if (!term) return
      if (!settings.categories[term.category]) return

      clearTimer()
      timerRef.current = setTimeout(() => {
        setTooltip({ term, anchorRect: span.getBoundingClientRect() })
      }, 150)
    },
    [clearTimer, settings]
  )

  const handleMouseOut = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('[data-light]')) return
      clearTimer()
      setTooltip(null)
    },
    [clearTimer]
  )

  useEffect(() => {
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      clearTimer()
    }
  }, [handleMouseOver, handleMouseOut, clearTimer])

  return (
    <>
      {tooltip && <TermTooltip term={tooltip.term} anchorRect={tooltip.anchorRect} />}
    </>
  )
}

