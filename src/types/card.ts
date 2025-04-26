export default interface Card {
  id: string;
  question: string;
  answer: string;
  deckId: string;
  easinessFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
