/*
  Warnings:

  - You are about to drop the column `maxWorksCount` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Work` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `authorId` on table `Work` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "maxWorksCount";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "providerId" INTEGER,
ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "provider" SET DEFAULT 'local';

-- AlterTable
ALTER TABLE "Work" DROP COLUMN "title",
ALTER COLUMN "authorId" SET NOT NULL;

-- CreateTable
CREATE TABLE "maxParticipant" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "challengeId" INTEGER NOT NULL,

    CONSTRAINT "maxParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "maxParticipant_userId_challengeId_key" ON "maxParticipant"("userId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_providerId_key" ON "User"("providerId");

-- AddForeignKey
ALTER TABLE "maxParticipant" ADD CONSTRAINT "maxParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maxParticipant" ADD CONSTRAINT "maxParticipant_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
