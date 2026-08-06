import type { Term } from '@/types/term'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/extract`

export async function extractTermsWithAI(text: string, apiKey: string): Promise<Term[]> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    throw new Error(`AI 추출 실패: ${response.status}`)
  }

  const data = await response.json()
  return data.terms as Term[]
}
