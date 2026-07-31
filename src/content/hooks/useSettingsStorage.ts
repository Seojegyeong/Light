import { useState, useEffect, useRef } from 'react'
import type { Settings } from '@/types/settings'
import { DEFAULT_SETTINGS } from '@/types/settings'

const STORAGE_KEY = 'light_settings'

export function useSettingsStorage(): [Settings, React.Dispatch<React.SetStateAction<Settings>>] {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const isLoadedRef = useRef(false)

  useEffect(() => {
    try {
      chrome.storage.sync.get(STORAGE_KEY, result => {
        try {
          if (result[STORAGE_KEY]) {
            setSettings(result[STORAGE_KEY] as Settings)
          }
        } catch {
          // 파싱 실패 시 기본값 유지
        }
        isLoadedRef.current = true
      })
    } catch {
      isLoadedRef.current = true
    }
  }, [])

  useEffect(() => {
    if (!isLoadedRef.current) return
    try {
      chrome.storage.sync.set({ [STORAGE_KEY]: settings })
    } catch {
      // 저장 실패 시 메모리 상태 유지
    }
  }, [settings])

  return [settings, setSettings]
}
