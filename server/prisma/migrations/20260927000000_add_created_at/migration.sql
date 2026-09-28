-- Registra quando cada feedback chegou (permite ordenar e medir volume por período)
ALTER TABLE "feedbacks" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX "feedbacks_createdAt_idx" ON "feedbacks"("createdAt");
