import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Global, css } from '@emotion/react'
import type { Term } from '@/types/term'
import { termService } from '@/services/termService'

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
      {tooltip && <BasicTooltip term={tooltip.term} anchorRect={tooltip.anchorRect} />}
    </>
  )
}

// Sprint 3에서 TermTooltip(Emotion 스타일)으로 교체
function BasicTooltip({ term, anchorRect }: { term: Term; anchorRect: DOMRect }): React.ReactElement {
  return (
    <div
      style={{
        position: 'fixed',
        top: anchorRect.top - 64,
        left: anchorRect.left,
        background: '#1a1a2e',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: 6,
        fontSize: 13,
        zIndex: 2147483647,
        pointerEvents: 'none',
        maxWidth: 260,
      }}
    >
      <strong>{term.name}</strong>
      <div style={{ marginTop: 4, fontSize: 12 }}>{term.description}</div>
    </div>
  )
}
