import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Global, css } from '@emotion/react'
import type { Term } from '@/types/term'
import { termService } from '@/services/termService'
import { TermTooltip } from './TermTooltip'

interface TooltipState {
  term: Term
  anchorRect: DOMRect
}

const resetStyles = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`

export function TooltipLayer(): React.ReactElement {
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
      const span = target.closest('[data-pinkkok]') as HTMLElement | null
      if (!span) return

      const termKey = span.getAttribute('data-pinkkok') ?? ''
      const term = termService.match(termKey)
      if (!term) return

      clearTimer()
      timerRef.current = setTimeout(() => {
        setTooltip({ term, anchorRect: span.getBoundingClientRect() })
      }, 150)
    },
    [clearTimer]
  )

  const handleMouseOut = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('[data-pinkkok]')) return
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
      <Global styles={resetStyles} />
      {tooltip && <TermTooltip term={tooltip.term} anchorRect={tooltip.anchorRect} />}
    </>
  )
}

