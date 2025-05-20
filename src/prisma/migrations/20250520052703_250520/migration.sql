/*
  Warnings:

  - You are about to drop the column `adminMessage` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `adminStatus` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `maxParticipant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `maxParticipant` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "adminStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'DELETED');

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_authorId_fkey";

-- DropForeignKey
ALTER TABLE "maxParticipant" DROP CONSTRAINT "maxParticipant_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "maxParticipant" DROP CONSTRAINT "maxParticipant_userId_fkey";

-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "adminMessage",
DROP COLUMN "adminStatus",
ADD COLUMN     "maxParticipant" INTEGER NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Feedback" ALTER COLUMN "content" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "authorId",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "message" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Work" ALTER COLUMN "content" SET DEFAULT '';

-- DropTable
DROP TABLE "maxParticipant";

-- DropEnum
DROP TYPE "AdminStatus";

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "authorId" TEXT NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "adminStatus" "adminStatus" NOT NULL DEFAULT 'PENDING',
    "adminMessage" TEXT,
    "invalidatedAt" TIMESTAMP(3),
    "appliedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_challengeId_key" ON "Application"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_userId_challengeId_key" ON "Participant"("userId", "challengeId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
