import React, { useRef, useState, useLayoutEffect } from 'react'
import styled from '@emotion/styled'
import type { Term } from '@/types/term'
import { color, fontFamily, radius, spacing } from '@/styles/tokens'

const OFFSET = 8
const EDGE_PAD = 8
const CARD_WIDTH = 280
const CARET_SIZE = 8

interface Props {
  term: Term
  anchorRect: DOMRect
}

interface Position {
  x: number
  y: number
  caretX: number
  flipped: boolean
  opacity: number
}

const Wrapper = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 2147483647;
  width: ${CARD_WIDTH}px;
  background: #fff;
  border-radius: ${radius.sm};
  box-shadow: 0 4px 20px rgba(20, 30, 60, 0.16);
  transition: opacity 0.12s ease;
  text-align: left;
`

const Caret = styled.div<{ $x: number; $flipped: boolean }>`
  position: absolute;
  left: ${p => p.$x}px;
  width: 0;
  height: 0;
  border-left: ${CARET_SIZE}px solid transparent;
  border-right: ${CARET_SIZE}px solid transparent;
  ${p =>
    p.$flipped
      ? `top: -${CARET_SIZE}px; border-bottom: ${CARET_SIZE}px solid #fff;`
      : `bottom: -${CARET_SIZE}px; border-top: ${CARET_SIZE}px solid #fff;`}
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[4]} ${spacing[4]} ${spacing[2]};
`

const TermName = styled.span`
  font-family: ${fontFamily.base};
  font-size: 14px;
  font-weight: 700;
  color: ${color.textPrimary};
  line-height: 1.4;
`

const CategoryBadge = styled.span<{ $cat: keyof typeof color.category }>`
  font-family: ${fontFamily.base};
  font-size: 11px;
  font-weight: 600;
  color: ${p => color.category[p.$cat]};
  background: ${p => color.category[p.$cat]}22;
  border-radius: ${radius.full};
  padding: 2px 8px;
  white-space: nowrap;
  flex-shrink: 0;
`

const Description = styled.p`
  font-family: ${fontFamily.base};
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
  color: ${color.textBody};
  margin: 0;
  padding: 0 ${spacing[4]} ${spacing[4]};
`

const ExampleSection = styled.div`
  border-top: 1px solid ${color.neutral100};
  padding: ${spacing[3]} ${spacing[4]} ${spacing[4]};
`

const ExampleLabel = styled.div`
  font-family: ${fontFamily.base};
  font-size: 11px;
  font-weight: 600;
  color: ${color.textCaption};
  margin-bottom: ${spacing[1]};
`

const ExampleText = styled.div`
  font-family: ${fontFamily.base};
  font-size: 12px;
  line-height: 1.6;
  color: ${color.textBody};
`

export function TermTooltip({ term, anchorRect }: Props): React.ReactElement {
  const cardRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<Position>({
    x: anchorRect.left,
    y: anchorRect.bottom + OFFSET,
    caretX: CARET_SIZE * 2,
    flipped: false,
    opacity: 0,
  })

  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return

    const h = el.offsetHeight

    // 기본: 앵커 위 / 공간 부족 시 아래로 flip
    let y = anchorRect.top - h - CARET_SIZE - OFFSET
    let flipped = false
    if (y < EDGE_PAD) {
      y = anchorRect.bottom + CARET_SIZE + OFFSET
      flipped = true
    }

    // 좌우 clamp
    let x = anchorRect.left
    const maxX = window.innerWidth - CARD_WIDTH - EDGE_PAD
    x = Math.min(Math.max(EDGE_PAD, x), maxX)

    // caret: 앵커 중심 기준 수평 위치
    const anchorCenterX = anchorRect.left + anchorRect.width / 2
    const caretX = Math.min(
      Math.max(CARET_SIZE * 2, anchorCenterX - x - CARET_SIZE),
      CARD_WIDTH - CARET_SIZE * 4
    )

    setPos({ x, y, caretX, flipped, opacity: 1 })
  }, [anchorRect])

  return (
    <Wrapper ref={cardRef} style={{ left: pos.x, top: pos.y, opacity: pos.opacity }}>
      <Caret $x={pos.caretX} $flipped={pos.flipped} />
      <Header>
        <TermName>{term.name}</TermName>
        {term.category && <CategoryBadge $cat={term.category}>{term.category}</CategoryBadge>}
      </Header>
      <Description>{term.description}</Description>
      {term.example && (
        <ExampleSection>
          <ExampleLabel>예시</ExampleLabel>
          <ExampleText>"{term.example}"</ExampleText>
        </ExampleSection>
      )}
    </Wrapper>
  )
}
