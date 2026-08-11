import React, { useState } from 'react'
import styled from '@emotion/styled'
import { color, fontFamily, radius, shadow, spacing } from '@/styles/tokens'
import { NoteTab } from './NoteTab'
import { SettingsTab } from './SettingsTab'
import { useDragPosition } from '../hooks/useDragPosition'

type Tab = 'note' | 'settings'

const BUTTON_SIZE = 50
const PANEL_WIDTH = 260
const PANEL_HEIGHT_ESTIMATE = 400
const PANEL_GAP = 12
const SCREEN_MARGIN = 8

const FloatButton = styled.button<{ $dragging: boolean }>`
  position: fixed;
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  border-radius: ${radius.full};
  background: ${color.blue500};
  border: none;
  cursor: ${p => (p.$dragging ? 'grabbing' : 'grab')};
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(23, 121, 225, 0.4);
  font-family: ${fontFamily.base};
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  z-index: 2147483646;
  transition: ${p => (p.$dragging ? 'none' : 'transform 0.15s ease, box-shadow 0.15s ease')};

  &:hover {
    transform: ${p => (p.$dragging ? 'none' : 'scale(1.06)')};
    box-shadow: ${p => (p.$dragging ? '0 4px 12px rgba(23, 121, 225, 0.4)' : '0 6px 16px rgba(23, 121, 225, 0.5)')};
  }
`

const Panel = styled.div`
  position: fixed;
  width: ${PANEL_WIDTH}px;
  background: #fff;
  border-radius: ${radius.md};
  box-shadow: 0 8px 32px rgba(20, 30, 60, 0.18);
  z-index: 2147483646;
  overflow: hidden;
`

const TabHeader = styled.div`
  display: flex;
  padding: ${spacing[2]};
  background: ${color.neutral100};
  gap: ${spacing[1]};
`

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${spacing[2]} 0;
  border: none;
  cursor: pointer;
  border-radius: ${radius.sm};
  font-family: ${fontFamily.base};
  font-size: 14px;
  font-weight: 500;
  transition: background 0.12s ease;
  background: ${p => (p.$active ? '#fff' : 'transparent')};
  color: ${p => (p.$active ? color.textPrimary : color.textCaption)};
  box-shadow: ${p => (p.$active ? shadow.soft : 'none')};
`

const TabContent = styled.div`
  padding: ${spacing[3]} ${spacing[4]};
  min-height: 120px;
  max-height: 360px;
  overflow-y: auto;
`

interface Props {
  detectedCount: number
}

export function FloatingPanel({ detectedCount }: Props): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('note')
  const { pos, isDragging, hasMoved, onMouseDown } = useDragPosition()

  const openAbove = pos.y > PANEL_HEIGHT_ESTIMATE + PANEL_GAP
  const panelTop = openAbove
    ? Math.max(SCREEN_MARGIN, pos.y - PANEL_HEIGHT_ESTIMATE - PANEL_GAP)
    : pos.y + BUTTON_SIZE + PANEL_GAP
  const panelLeft = Math.max(
    SCREEN_MARGIN,
    Math.min(window.innerWidth - PANEL_WIDTH - SCREEN_MARGIN, pos.x + BUTTON_SIZE - PANEL_WIDTH)
  )

  return (
    <>
      {isOpen && (
        <Panel style={{ top: panelTop, left: panelLeft }}>
          <TabHeader>
            <TabButton
              $active={activeTab === 'note'}
              onClick={() => setActiveTab('note')}
            >
              내 노트
            </TabButton>
            <TabButton
              $active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            >
              설정
            </TabButton>
          </TabHeader>
          <TabContent>
            {activeTab === 'note' ? <NoteTab /> : <SettingsTab />}
          </TabContent>
        </Panel>
      )}
      <FloatButton
        $dragging={isDragging}
        style={{ top: pos.y, left: pos.x }}
        onMouseDown={onMouseDown}
        onClick={() => {
          if (hasMoved.current) return
          setIsOpen(prev => !prev)
        }}
      >
        {detectedCount}
      </FloatButton>
    </>
  )
}
