/* Persistência com Prisma + PostgreSQL (depende só do formato mínimo do cliente, não do tipo gerado) */
import { FeedbackCreateData, FeedbacksRepository } from "../feedbacks-repository";

export interface PrismaLike {
  feedback: {
    create(args: { data: FeedbackCreateData; select: { id: true } }): Promise<{ id: string }>;
    count(args: { where: { createdAt: { gte: Date } } }): Promise<number>;
  };
}

export class PrismaFeedbacksRepository implements FeedbacksRepository {
  /* Recebe o cliente Prisma já criado (uma instância por processo) */
  constructor(private readonly prisma: PrismaLike) {}

  /* Grava o feedback e devolve o id */
  async create({ type, comment, screenshot }: FeedbackCreateData) {
    return this.prisma.feedback.create({ data: { type, comment, screenshot }, select: { id: true } });
  }

  /* Quantidade de feedbacks desde a data informada */
  async countSince(since: Date) {
    return this.prisma.feedback.count({ where: { createdAt: { gte: since } } });
  }
}
/* Fim de prisma-feedbacks-repository.ts */
