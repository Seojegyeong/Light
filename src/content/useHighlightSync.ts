import { useEffect } from 'react'
import type { Settings, HighlightColor } from '@/types/settings'

const COLOR_MAP: Record<HighlightColor, { bg: string; border: string }> = {
  blue:   { bg: 'rgba(200, 224, 255, 0.35)', border: '#1779e1' },
  green:  { bg: 'rgba(103, 179, 106, 0.2)',  border: '#67b36a' },
  orange: { bg: 'rgba(228, 125, 109, 0.2)',  border: '#e47d6d' },
}

function buildStyles(settings: Settings): string {
  const { bg, border } = COLOR_MAP[settings.color]

  const baseRule = settings.enabled
    ? `[data-pinkkok] {
        background-color: ${bg};
        border-bottom: 1.5px dashed ${border};
        border-radius: 2px;
        padding: 1px 3px;
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
        cursor: default;
      }`
    : `[data-pinkkok] {
        background-color: transparent;
        border-bottom: none;
        cursor: default;
      }`

  const categoryRules = Object.entries(settings.categories)
    .filter(([, enabled]) => !enabled)
    .map(([cat]) => `[data-pinkkok-category="${cat}"] {
        background-color: transparent !important;
        border-bottom: none !important;
      }`)

  return [baseRule, ...categoryRules].join('\n')
}

export function useHighlightSync(settings: Settings): void {
  useEffect(() => {
    const el = document.getElementById('pinkkok-styles')
    if (!el) return
    el.textContent = buildStyles(settings)
  }, [settings])
}
