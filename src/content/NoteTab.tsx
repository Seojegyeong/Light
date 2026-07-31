import React from 'react'
import styled from '@emotion/styled'
import { color, fontFamily, spacing } from '@/styles/tokens'
import { useSettings } from './SettingsContext'

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing[3]};
`

const HeaderLabel = styled.span`
  font-family: ${fontFamily.base};
  font-size: 12px;
  font-weight: 600;
  color: ${color.textCaption};
`

const EmptyText = styled.p`
  font-family: ${fontFamily.base};
  font-size: 13px;
  color: ${color.textCaption};
  text-align: center;
  padding: ${spacing[4]} 0;
`

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
`

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing[2]} 0;
  border-bottom: 1px solid ${color.neutral100};

  &:last-child {
    border-bottom: none;
  }
`

const TermName = styled.span`
  font-family: ${fontFamily.base};
  font-size: 14px;
  font-weight: 500;
  color: ${color.textPrimary};
`

const CategoryBadge = styled.span<{ $cat: keyof typeof color.category }>`
  font-family: ${fontFamily.base};
  font-size: 11px;
  font-weight: 600;
  color: ${p => color.category[p.$cat]};
  background: ${p => color.category[p.$cat]}22;
  border-radius: 99px;
  padding: 2px 8px;
  white-space: nowrap;
  flex-shrink: 0;
`

export function NoteTab(): React.ReactElement {
  const { detectedTerms } = useSettings()

  return (
    <div>
      <Header>
        <HeaderLabel>저장된 키워드 · {detectedTerms.length}</HeaderLabel>
      </Header>
      {detectedTerms.length === 0 ? (
        <EmptyText>감지된 키워드가 없습니다.</EmptyText>
      ) : (
        <List>
          {detectedTerms.map(term => (
            <ListItem key={term.id}>
              <TermName>{term.name}</TermName>
              <CategoryBadge $cat={term.category}>{term.category}</CategoryBadge>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  )
}
