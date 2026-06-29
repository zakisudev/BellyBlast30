import { MOTIVATIONAL_QUOTES } from "@/constants/quotes";

export class QuoteService {
  static getDailyQuote(seedDate: string): string {
    const hash = Array.from(seedDate).reduce((sum, character) => sum + character.charCodeAt(0), 0);
    return MOTIVATIONAL_QUOTES[hash % MOTIVATIONAL_QUOTES.length];
  }
}
