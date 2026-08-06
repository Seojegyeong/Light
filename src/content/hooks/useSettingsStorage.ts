import { useState, useEffect, useRef } from 'react'
import type { Settings } from '@/types/settings'
import { DEFAULT_SETTINGS } from '@/types/settings'

const SETTINGS_KEY = 'light_settings'
const API_KEY_STORAGE_KEY = 'light_api_key'

export function useSettingsStorage(): {
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  apiKey: string
  setApiKey: (key: string) => void
  storageError: string | null
} {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [apiKey, setApiKeyState] = useState<string>('')
  const [storageError, setStorageError] = useState<string | null>(null)
  const isLoadedRef = useRef(false)

  useEffect(() => {
    chrome.storage.sync.get(SETTINGS_KEY, result => {
      if (chrome.runtime.lastError) {
        setStorageError('설정을 불러오는 데 실패했습니다. 기본값으로 실행됩니다.')
        isLoadedRef.current = true
        return
      }
      if (result[SETTINGS_KEY]) {
        setSettings(result[SETTINGS_KEY] as Settings)
      }
      isLoadedRef.current = true
    })

    chrome.storage.local.get(API_KEY_STORAGE_KEY, result => {
      if (result[API_KEY_STORAGE_KEY]) {
        setApiKeyState(result[API_KEY_STORAGE_KEY] as string)
      }
    })
  }, [])

  useEffect(() => {
    if (!isLoadedRef.current) return
    chrome.storage.sync.set({ [SETTINGS_KEY]: settings }, () => {
      if (chrome.runtime.lastError) {
        setStorageError('설정 저장에 실패했습니다.')
      }
    })
  }, [settings])

  const setApiKey = (key: string) => {
    setApiKeyState(key)
    chrome.storage.local.set({ [API_KEY_STORAGE_KEY]: key }, () => {
      if (chrome.runtime.lastError) {
        setStorageError('API 키 저장에 실패했습니다.')
      }
    })
  }

  return { settings, setSettings, apiKey, setApiKey, storageError }
}
