import type { Term } from '@/types/term';
import termsData from '@/data/terms.json';

class TermService {
  private readonly lookup: Map<string, Term>;

  constructor() {
    this.lookup = new Map();
    for (const term of termsData as Term[]) {
      const tagged: Term = { ...term, source: 'builtin' }
      this.lookup.set(term.name.toLowerCase(), tagged);
      for (const alias of term.aliases) {
        this.lookup.set(alias.toLowerCase(), tagged);
      }
    }
  }

  match(text: string): Term | undefined {
    return this.lookup.get(text.trim().toLowerCase());
  }

  get keys(): Set<string> {
    return new Set(this.lookup.keys());
  }
}

export const termService = new TermService();
