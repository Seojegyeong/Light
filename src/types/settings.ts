import type { TermCategory } from './term'

export type HighlightColor = 'blue' | 'green' | 'orange'

export interface Settings {
  enabled: boolean
  categories: Record<TermCategory, boolean>
  color: HighlightColor
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  categories: {
    주식: true,
    채권: true,
    거시경제: true,
    파생상품: true,
    부동산: true,
    회계: true,
  },
  color: 'blue',
}
