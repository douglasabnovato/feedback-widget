/* Ponto de entrada: escolhe adaptadores conforme o ambiente e sobe a API */
import "dotenv/config";
import { loadConfig } from "./config";
import { createApp } from "./app";
import { NodemailerMailAdapter } from "./adapters/nodemailer/nodemailer-mail-adapter";
import { ConsoleMailAdapter } from "./adapters/console/console-mail-adapter";
import { PrismaFeedbacksRepository, PrismaLike } from "./repositories/prisma/prisma-feedbacks-repository";
import { InMemoryFeedbacksRepository } from "./repositories/in-memory/in-memory-feedbacks-repository";

/* Carrega o cliente gerado por `prisma generate` só quando há banco configurado */
function createPrisma(): PrismaLike {
  const { PrismaClient } = require("@prisma/client") as { PrismaClient: new () => PrismaLike };
  return new PrismaClient();
}

/* Inicializa e escuta na porta configurada */
function main() {
  const config = loadConfig();
  const feedbacks = process.env.DATABASE_URL ? new PrismaFeedbacksRepository(createPrisma()) : new InMemoryFeedbacksRepository();
  if (!process.env.DATABASE_URL) console.warn("DATABASE_URL ausente: feedbacks ficam só em memória.");
  const mail = config.mail.host && config.mail.to ? new NodemailerMailAdapter(config.mail) : new ConsoleMailAdapter();
  createApp({ feedbacks, mail, config }).listen(config.port, () => console.log(`HTTP server running on port ${config.port}`));
}

main();
/* Fim de server.ts */
