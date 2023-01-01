-- CreateTable
CREATE TABLE "CalcJobResult" (
    "id" UUID NOT NULL,
    "input" BIGINT NOT NULL,
    "output" BIGINT,

    CONSTRAINT "CalcJobResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalcJobStatus" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "CalcJobStatus_pkey" PRIMARY KEY ("id")
);
