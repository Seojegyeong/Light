import { useState, useEffect, useRef } from 'react'
import type { Settings } from '@/types/settings'
import { DEFAULT_SETTINGS } from '@/types/settings'

const STORAGE_KEY = 'light_settings'

export function useSettingsStorage(): [Settings, React.Dispatch<React.SetStateAction<Settings>>] {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const isLoadedRef = useRef(false)

  useEffect(() => {
    chrome.storage.sync.get(STORAGE_KEY, result => {
      if (result[STORAGE_KEY]) {
        setSettings(result[STORAGE_KEY] as Settings)
      }
      isLoadedRef.current = true
    })
  }, [])

  useEffect(() => {
    if (!isLoadedRef.current) return
    chrome.storage.sync.set({ [STORAGE_KEY]: settings })
  }, [settings])

  return [settings, setSettings]
}
