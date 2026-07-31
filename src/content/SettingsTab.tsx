import React from 'react'
import styled from '@emotion/styled'
import { color, fontFamily, radius, spacing } from '@/styles/tokens'
import type { HighlightColor } from '@/types/settings'
import { useSettings } from './SettingsContext'
import type { TermCategory } from '@/types/term'

const CATEGORIES: TermCategory[] = ['주식', '채권', '거시경제', '파생상품', '부동산', '회계']

const COLOR_PRESETS: Record<HighlightColor, string> = {
  blue: color.blue500,
  green: '#67b36a',
  orange: '#e47d6d',
}

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
  transition: outline 0.15s ease, border 0.15s ease;
`

// ─── Component ─────────────────────────────────────────────────
export function SettingsTab(): React.ReactElement {
  const { settings, setSettings } = useSettings()

  const setEnabled = (v: boolean) =>
    setSettings(prev => ({ ...prev, enabled: v }))

  const setCategory = (cat: TermCategory, v: boolean) =>
    setSettings(prev => ({
      ...prev,
      categories: { ...prev.categories, [cat]: v },
    }))

  const setColor = (c: HighlightColor) =>
    setSettings(prev => ({ ...prev, color: c }))

  return (
    <div>
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
          {(Object.entries(COLOR_PRESETS) as [HighlightColor, string][]).map(
            ([key, hex]) => (
              <ColorSwatch
                key={key}
                $hex={hex}
                $selected={settings.color === key}
                onClick={() => setColor(key)}
              />
            )
          )}
        </ColorRow>
      </Section>
    </div>
  )
}
