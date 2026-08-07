import React, { useState } from 'react'
import styled from '@emotion/styled'
import { color, fontFamily, radius, spacing } from '@/styles/tokens'
import { useSettings } from '../SettingsContext'
import type { TermCategory } from '@/types/term'

const CATEGORIES: TermCategory[] = ['주식', '채권', '거시경제', '파생상품', '부동산', '회계']

const COLOR_PRESETS: { hex: string; label: string }[] = [
  { hex: '#59A6FF', label: '파랑' },
  { hex: '#E0C8F7', label: '보라' },
  { hex: '#FFC7DF', label: '핑크' },
  { hex: '#FDF1C4', label: '노랑' },
  { hex: '#DBF9E7', label: '초록' },
  { hex: '#D8F8F4', label: '민트' },
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

const ApiKeyInputWrapper = styled.div`
  position: relative;
  flex: 1;
`

const ApiKeyInput = styled.input`
  width: 100%;
  height: 32px;
  border: 1px solid ${color.neutral200};
  border-radius: ${radius.sm};
  padding: 0 32px 0 ${spacing[2]};
  font-family: ${fontFamily.base};
  font-size: 13px;
  color: ${color.textPrimary};
  background: #fff;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: ${color.blue500};
  }
`

const EyeButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: ${color.textCaption};
  &:hover {
    color: ${color.textPrimary};
  }
`

const ApiKeyButton = styled.button`
  height: 32px;
  padding: 0 ${spacing[3]};
  border: none;
  border-radius: ${radius.sm};
  background: ${color.blue500};
  color: #fff;
  font-family: ${fontFamily.base};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  &:hover {
    opacity: 0.9;
  }
`

const ApiKeyLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  margin-bottom: ${spacing[1]};
`

const ConnectedBadge = styled.span`
  font-family: ${fontFamily.base};
  font-size: 10px;
  font-weight: 600;
  color: #27ae60;
  display: flex;
  align-items: center;
  gap: 3px;

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #27ae60;
  }
`

const ApiKeyRow = styled.div`
  display: flex;
  gap: ${spacing[2]};
  margin-top: ${spacing[2]};
`

// ─── Component ─────────────────────────────────────────────────
export function SettingsTab(): React.ReactElement {
  const { settings, setSettings, apiKey, setApiKey, storageError } = useSettings()
  const [inputKey, setInputKey] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)

  const isSaved = inputKey.trim() === apiKey && apiKey !== ''

  const setCategory = (cat: TermCategory, v: boolean) =>
    setSettings(prev => ({
      ...prev,
      categories: { ...prev.categories, [cat]: v },
    }))

  const setColor = (hex: string) =>
    setSettings(prev => ({ ...prev, color: hex }))

  const handleSaveApiKey = () => {
    setApiKey(inputKey.trim())
  }

  return (
    <div>
      {storageError && <ErrorBanner>{storageError}</ErrorBanner>}
      <Section>
        <ApiKeyLabelRow>
          <SectionLabel style={{ margin: 0 }}>Anthropic API 키</SectionLabel>
          {isSaved && <ConnectedBadge>연동됨</ConnectedBadge>}
        </ApiKeyLabelRow>
        <ApiKeyRow>
          <ApiKeyInputWrapper>
            <ApiKeyInput
              type={showKey ? 'text' : 'password'}
              placeholder="sk-ant-..."
              value={inputKey}
              onChange={e => setInputKey(e.target.value)}
            />
            <EyeButton type="button" onClick={() => setShowKey(prev => !prev)}>
              {showKey ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </EyeButton>
          </ApiKeyInputWrapper>
          <ApiKeyButton onClick={handleSaveApiKey}>저장</ApiKeyButton>
        </ApiKeyRow>
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
