import { useState, useEffect, useRef } from 'react'
import type { Settings } from '@/types/settings'
import { DEFAULT_SETTINGS } from '@/types/settings'

const STORAGE_KEY = 'light_settings'

export function useSettingsStorage(): [Settings, React.Dispatch<React.SetStateAction<Settings>>, string | null] {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [storageError, setStorageError] = useState<string | null>(null)
  const isLoadedRef = useRef(false)

  useEffect(() => {
    try {
      chrome.storage.sync.get(STORAGE_KEY, result => {
        try {
          if (result[STORAGE_KEY]) {
            setSettings(result[STORAGE_KEY] as Settings)
          }
        } catch {
          setStorageError('설정을 불러오는 데 실패했습니다. 기본값으로 실행됩니다.')
        }
        isLoadedRef.current = true
      })
    } catch {
      setStorageError('설정을 불러오는 데 실패했습니다. 기본값으로 실행됩니다.')
      isLoadedRef.current = true
    }
  }, [])

  useEffect(() => {
    if (!isLoadedRef.current) return
    try {
      chrome.storage.sync.set({ [STORAGE_KEY]: settings })
    } catch {
      setStorageError('설정 저장에 실패했습니다.')
    }
  }, [settings])

  return [settings, setSettings, storageError]
}
