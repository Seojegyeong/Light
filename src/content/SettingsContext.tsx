import { createContext, useContext } from 'react'
import type React from 'react'
import type { Term } from '@/types/term'
import type { Settings } from '@/types/settings'

interface SettingsContextValue {
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  apiKey: string
  setApiKey: (key: string) => void
  detectedTerms: Term[]
  storageError: string | null
  rescanWithAI: (key: string) => void
  isAiScanning: boolean
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsContext.Provider')
  return ctx
}
