import React from 'react'
import { Global, css } from '@emotion/react'
import type { Term } from '@/types/term'
import { SettingsContext, useSettings } from './SettingsContext'
import { TooltipLayer } from './components/TooltipLayer'
import { FloatingPanel } from './components/FloatingPanel'
import { useHighlightSync } from './hooks/useHighlightSync'
import { useSettingsStorage } from './hooks/useSettingsStorage'

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

export function PinkKokApp({ detectedTerms }: Props): React.ReactElement {
  const [settings, setSettings] = useSettingsStorage()

  return (
    <SettingsContext.Provider value={{ settings, setSettings, detectedTerms }}>
      <AppInner detectedTerms={detectedTerms} />
    </SettingsContext.Provider>
  )
}
