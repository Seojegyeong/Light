import React, { useState } from 'react'
import { Global, css } from '@emotion/react'
import type { Term } from '@/types/term'
import { DEFAULT_SETTINGS } from '@/types/settings'
import type { Settings } from '@/types/settings'
import { SettingsContext } from './SettingsContext'
import { TooltipLayer } from './TooltipLayer'

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

export function PinkKokApp({ detectedTerms }: Props): React.ReactElement {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  return (
    <SettingsContext.Provider value={{ settings, setSettings, detectedTerms }}>
      <Global styles={resetStyles} />
      <TooltipLayer />
      {/* FloatingPanel — 4단계에서 추가 */}
    </SettingsContext.Provider>
  )
}
