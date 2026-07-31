import { useEffect } from 'react'
import type { Settings } from '@/types/settings'

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function buildStyles(settings: Settings): string {
  const bg = hexToRgba(settings.color, 0.2)
  const border = settings.color

  const baseRule = settings.enabled
    ? `[data-light] {
        background-color: ${bg};
        border-bottom: 1.5px dashed ${border};
        border-radius: 2px;
        padding: 1px 3px;
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
        cursor: default;
      }`
    : `[data-light] {
        background-color: transparent;
        border-bottom: none;
        cursor: default;
      }`

  const categoryRules = Object.entries(settings.categories)
    .filter(([, enabled]) => !enabled)
    .map(([cat]) => `[data-light-category="${cat}"] {
        background-color: transparent !important;
        border-bottom: none !important;
      }`)

  return [baseRule, ...categoryRules].join('\n')
}

export function useHighlightSync(settings: Settings): void {
  useEffect(() => {
    const el = document.getElementById('light-styles')
    if (!el) return
    el.textContent = buildStyles(settings)
  }, [settings])
}
