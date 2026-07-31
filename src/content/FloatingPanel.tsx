import React, { useState } from 'react'
import styled from '@emotion/styled'
import { color, fontFamily, radius, shadow, spacing } from '@/styles/tokens'
import { useSettings } from './SettingsContext'

type Tab = 'note' | 'settings'

const PANEL_WIDTH = 260
const BOTTOM_MARGIN = 24
const RIGHT_MARGIN = 24

const FloatButton = styled.button`
  position: fixed;
  bottom: ${BOTTOM_MARGIN}px;
  right: ${RIGHT_MARGIN}px;
  width: 50px;
  height: 50px;
  border-radius: ${radius.full};
  background: ${color.blue500};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(23, 121, 225, 0.4);
  font-family: ${fontFamily.base};
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  z-index: 2147483646;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: scale(1.06);
    box-shadow: 0 6px 16px rgba(23, 121, 225, 0.5);
  }
`

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: ${radius.full};
  background: #fff;
  color: ${color.blue500};
  font-family: ${fontFamily.base};
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
`

const Panel = styled.div`
  position: fixed;
  bottom: ${BOTTOM_MARGIN + 50 + 12}px;
  right: ${RIGHT_MARGIN}px;
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
`

interface Props {
  detectedCount: number
}

export function FloatingPanel({ detectedCount }: Props): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('note')
  const { settings } = useSettings()

  return (
    <>
      {isOpen && (
        <Panel>
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
            {/* NoteTab / SettingsTab — 5·6단계에서 교체 */}
            {activeTab === 'note' ? '내 노트 탭' : '설정 탭'}
          </TabContent>
        </Panel>
      )}
      <FloatButton onClick={() => setIsOpen(prev => !prev)}>
        {settings.enabled ? detectedCount : '—'}
        {detectedCount > 0 && <Badge>{detectedCount}</Badge>}
      </FloatButton>
    </>
  )
}
