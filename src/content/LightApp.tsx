import React, { useState } from 'react'
import { Global, css } from '@emotion/react'
import type { Term } from '@/types/term'
import { SettingsContext, useSettings } from './context/SettingsContext'
import { TooltipLayer } from './components/TooltipLayer'
import { FloatingPanel } from './components/FloatingPanel'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useHighlightSync } from './hooks/useHighlightSync'
import { useSettingsStorage } from './hooks/useSettingsStorage'
import { scanWithTerms } from './utils/scanner'
import { extractTermsWithAI } from '@/services/aiExtractService'

interface Props {
  detectedTerms: Term[]
}

const resetStyles = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`

function AppInner({ detectedTerms }: Props): React.ReactElement {
  const { settings } = useSettings()
  useHighlightSync(settings)

  return (
    <>
      <Global styles={resetStyles} />
      <TooltipLayer />
      <FloatingPanel detectedCount={detectedTerms.length} />
    </>
  )
}

export function LightApp({ detectedTerms: initialDetectedTerms }: Props): React.ReactElement {
  const { settings, setSettings, apiKey, setApiKey, storageError } = useSettingsStorage()
  const [detectedTerms, setDetectedTerms] = useState(initialDetectedTerms)
  const [isAiScanning, setIsAiScanning] = useState(false)

  const rescanWithAI = (key: string) => {
    if (!key) return
    setIsAiScanning(true)
    extractTermsWithAI(document.body.innerText, key)
      .then(rawAiTerms => {
        const taggedAiTerms = rawAiTerms.map(t => ({ ...t, id: t.id ?? t.name, aliases: t.aliases ?? [], source: 'ai' as const }))
        const newAiDetected = scanWithTerms(taggedAiTerms)
        setDetectedTerms(prev => [
          ...prev.filter(t => !t.source || t.source === 'builtin'),
          ...newAiDetected,
        ])
      })
      .catch(() => {})
      .finally(() => setIsAiScanning(false))
  }

  return (
    <ErrorBoundary>
      <SettingsContext.Provider value={{ settings, setSettings, apiKey, setApiKey, detectedTerms, storageError, rescanWithAI, isAiScanning }}>
        <AppInner detectedTerms={detectedTerms} />
      </SettingsContext.Provider>
    </ErrorBoundary>
  )
}
