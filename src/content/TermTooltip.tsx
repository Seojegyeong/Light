import React, { useRef, useState, useLayoutEffect } from 'react'
import styled from '@emotion/styled'
import type { Term } from '@/types/term'
import { color, radius, spacing } from '@/styles/tokens'

const OFFSET = 8
const EDGE_PAD = 8

const Card = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 2147483647;
  width: 240px;
  background: ${color.neutral900};
  border-radius: ${radius.sm};
  padding: ${spacing[3]};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transition: opacity 0.12s ease;
`

const CategoryBadge = styled.span<{ $cat: keyof typeof color.category }>`
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${p => color.category[p.$cat]};
  margin-bottom: ${spacing[1]};
`

const TermName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: ${spacing[1]};
`

const Description = styled.div`
  font-size: 12px;
  line-height: 1.6;
  color: ${color.neutral200};
`

interface Props {
  term: Term
  anchorRect: DOMRect
}

export function TermTooltip({ term, anchorRect }: Props): React.ReactElement {
  const cardRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({
    left: anchorRect.left,
    top: anchorRect.top,
    opacity: 0,
  })

  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return

    const h = el.offsetHeight
    const w = el.offsetWidth

    let y = anchorRect.top - h - OFFSET
    if (y < EDGE_PAD) {
      y = anchorRect.bottom + OFFSET
    }

    let x = anchorRect.left
    const maxX = window.innerWidth - w - EDGE_PAD
    x = Math.min(Math.max(EDGE_PAD, x), maxX)

    setStyle({ left: x, top: y, opacity: 1 })
  }, [anchorRect])

  return (
    <Card ref={cardRef} style={style}>
      <CategoryBadge $cat={term.category}>{term.category}</CategoryBadge>
      <TermName>{term.name}</TermName>
      <Description>{term.description}</Description>
    </Card>
  )
}
