export type TermCategory =
  | '주식'
  | '채권'
  | '거시경제'
  | '파생상품'
  | '부동산'
  | '회계';

export interface Term {
  id: string;
  name: string;
  category: TermCategory;
  description: string;
  aliases: string[];
}
