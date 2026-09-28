/* Contrato de persistência de feedbacks */
export type FeedbackType = "BUG" | "IDEA" | "OTHER";

export interface FeedbackCreateData {
  type: FeedbackType;
  comment: string;
  screenshot?: string | null;
}

export interface FeedbacksRepository {
  create: (data: FeedbackCreateData) => Promise<{ id: string }>;
  countSince: (since: Date) => Promise<number>;
}
/* Fim de feedbacks-repository.ts */
