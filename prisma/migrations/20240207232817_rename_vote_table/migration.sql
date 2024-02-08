/*
  Warnings:

  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pollId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_pollOptionId_fkey";

-- DropTable
DROP TABLE "Vote";

-- CreateTable
CREATE TABLE "vote" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "pollOptionId" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vote_sessionId_pollId_key" ON "vote"("sessionId", "pollId");

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_pollOptionId_fkey" FOREIGN KEY ("pollOptionId") REFERENCES "poll_option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
