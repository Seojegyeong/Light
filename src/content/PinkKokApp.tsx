import React, { useState } from 'react'
import { Global, css } from '@emotion/react'
import type { Term } from '@/types/term'
import { DEFAULT_SETTINGS } from '@/types/settings'
import type { Settings } from '@/types/settings'
import { SettingsContext, useSettings } from './SettingsContext'
import { TooltipLayer } from './TooltipLayer'
import { FloatingPanel } from './FloatingPanel'
import { useHighlightSync } from './useHighlightSync'

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
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  return (
    <SettingsContext.Provider value={{ settings, setSettings, detectedTerms }}>
      <AppInner detectedTerms={detectedTerms} />
    </SettingsContext.Provider>
  )
}
