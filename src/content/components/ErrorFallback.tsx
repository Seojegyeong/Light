import React from 'react'
import styled from '@emotion/styled'
import { color, fontFamily, radius, shadow, spacing } from '@/styles/tokens'

const BOTTOM_MARGIN = 24
const RIGHT_MARGIN = 24

const Wrapper = styled.div`
  position: fixed;
  bottom: ${BOTTOM_MARGIN}px;
  right: ${RIGHT_MARGIN}px;
  width: 260px;
  background: #fff;
  border-radius: ${radius.md};
  box-shadow: 0 8px 32px rgba(20, 30, 60, 0.18);
  z-index: 2147483646;
  padding: ${spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`

const Title = styled.p`
  font-family: ${fontFamily.base};
  font-size: 14px;
  font-weight: 600;
  color: ${color.textPrimary};
  margin: 0;
`

const Description = styled.p`
  font-family: ${fontFamily.base};
  font-size: 13px;
  color: ${color.textBody};
  line-height: 1.5;
  margin: 0;
`

const RetryButton = styled.button`
  align-self: flex-end;
  padding: ${spacing[2]} ${spacing[3]};
  background: ${color.blue500};
  color: #fff;
  border: none;
  border-radius: ${radius.sm};
  font-family: ${fontFamily.base};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: ${shadow.soft};
  transition: opacity 0.12s ease;

  &:hover {
    opacity: 0.88;
  }
`

interface Props {
  onRetry: () => void
}

export function ErrorFallback({ onRetry }: Props): React.ReactElement {
  return (
    <Wrapper>
      <Title>일시적인 오류가 발생했어요</Title>
      <Description>페이지를 새로고침하거나 다시 시도해 주세요.</Description>
      <RetryButton onClick={onRetry}>다시 시도</RetryButton>
    </Wrapper>
  )
}
