import React from 'react'
import styled from '@emotion/styled'
import { color, fontFamily, radius, spacing } from '@/styles/tokens'
import { useSettings } from '../SettingsContext'
import type { TermCategory } from '@/types/term'

const CATEGORIES: TermCategory[] = ['주식', '채권', '거시경제', '파생상품', '부동산', '회계']

const COLOR_PRESETS: { hex: string; label: string }[] = [
  { hex: '#1779e1', label: '파랑' },
  { hex: '#67b36a', label: '초록' },
  { hex: '#e47d6d', label: '주황' },
  { hex: '#9b5de5', label: '보라' },
  { hex: '#e5698b', label: '핑크' },
  { hex: '#e53935', label: '빨강' },
]

// ─── Toggle ────────────────────────────────────────────────────
const ToggleTrack = styled.button<{ $on: boolean }>`
  position: relative;
  width: 38px;
  height: 22px;
  border-radius: ${radius.full};
  border: none;
  cursor: pointer;
  background: ${p => (p.$on ? color.blue500 : color.neutral200)};
  transition: background 0.2s ease;
  flex-shrink: 0;
`

const ToggleThumb = styled.span<{ $on: boolean }>`
  position: absolute;
  top: 4px;
  left: ${p => (p.$on ? '18px' : '4px')};
  width: 14px;
  height: 14px;
  border-radius: ${radius.full};
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: left 0.2s ease;
`

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <ToggleTrack $on={on} onClick={() => onChange(!on)}>
      <ToggleThumb $on={on} />
    </ToggleTrack>
  )
}

// ─── Layout ────────────────────────────────────────────────────
const Section = styled.div`
  & + & {
    margin-top: ${spacing[4]};
    padding-top: ${spacing[4]};
    border-top: 1px solid ${color.neutral100};
  }
`

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing[2]} 0;
`

const Label = styled.span`
  font-family: ${fontFamily.base};
  font-size: 14px;
  font-weight: 500;
  color: ${color.textPrimary};
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`

const CategoryDot = styled.span<{ $cat: TermCategory }>`
  width: 8px;
  height: 8px;
  border-radius: ${radius.full};
  background: ${p => color.category[p.$cat]};
  display: inline-block;
  flex-shrink: 0;
`

const SectionLabel = styled.div`
  font-family: ${fontFamily.base};
  font-size: 11px;
  font-weight: 600;
  color: ${color.textCaption};
  margin-bottom: ${spacing[1]};
`

const ColorRow = styled.div`
  display: flex;
  gap: ${spacing[2]};
  margin-top: ${spacing[2]};
  flex-wrap: wrap;
`

const ColorSwatch = styled.button<{ $hex: string; $selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: ${radius.full};
  background: ${p => p.$hex};
  border: 2px solid ${p => (p.$selected ? color.neutral900 : 'transparent')};
  cursor: pointer;
  outline: ${p => (p.$selected ? `2px solid ${p.$hex}` : 'none')};
  outline-offset: 2px;
  flex-shrink: 0;
  transition: outline 0.15s ease, border 0.15s ease;
`

const ErrorBanner = styled.div`
  background: #fff3f3;
  border: 1px solid #f5b8b8;
  border-radius: ${radius.sm};
  padding: ${spacing[2]} ${spacing[3]};
  margin-bottom: ${spacing[3]};
  font-family: ${fontFamily.base};
  font-size: 12px;
  color: #c0392b;
  line-height: 1.5;
`

// ─── Component ─────────────────────────────────────────────────
export function SettingsTab(): React.ReactElement {
  const { settings, setSettings, storageError } = useSettings()

  const setEnabled = (v: boolean) =>
    setSettings(prev => ({ ...prev, enabled: v }))

  const setCategory = (cat: TermCategory, v: boolean) =>
    setSettings(prev => ({
      ...prev,
      categories: { ...prev.categories, [cat]: v },
    }))

  const setColor = (hex: string) =>
    setSettings(prev => ({ ...prev, color: hex }))

  return (
    <div>
      {storageError && <ErrorBanner>{storageError}</ErrorBanner>}
      <Section>
        <Row>
          <Label>전체 사용</Label>
          <Toggle on={settings.enabled} onChange={setEnabled} />
        </Row>
      </Section>

      <Section>
        <SectionLabel>카테고리</SectionLabel>
        {CATEGORIES.map(cat => (
          <Row key={cat}>
            <Label>
              <CategoryDot $cat={cat} />
              {cat}
            </Label>
            <Toggle
              on={settings.categories[cat]}
              onChange={v => setCategory(cat, v)}
            />
          </Row>
        ))}
      </Section>

      <Section>
        <SectionLabel>하이라이트 색상</SectionLabel>
        <ColorRow>
          {COLOR_PRESETS.map(({ hex, label }) => (
            <ColorSwatch
              key={label}
              $hex={hex}
              $selected={settings.color === hex}
              onClick={() => setColor(hex)}
            />
          ))}
        </ColorRow>
      </Section>
    </div>
  )
}
