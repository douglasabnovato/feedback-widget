/* Repositório em memória (testes e demonstração sem banco) */
import { randomUUID } from "node:crypto";
import { FeedbackCreateData, FeedbacksRepository } from "../feedbacks-repository";

export class InMemoryFeedbacksRepository implements FeedbacksRepository {
  public items: Array<FeedbackCreateData & { id: string; createdAt: Date }> = [];

  /* Guarda o feedback na lista */
  async create(data: FeedbackCreateData) {
    const item = { ...data, id: randomUUID(), createdAt: new Date() };
    this.items.push(item);
    return { id: item.id };
  }

  /* Conta feedbacks a partir da data */
  async countSince(since: Date) {
    return this.items.filter((i) => i.createdAt >= since).length;
  }
}
/* Fim de in-memory-feedbacks-repository.ts */
