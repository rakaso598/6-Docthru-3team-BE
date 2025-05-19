/*
  Warnings:

  - You are about to drop the column `type` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `workId` on the `Work` table. All the data in the column will be lost.
  - Added the required column `docType` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "type",
ADD COLUMN     "docType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "type",
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Work" DROP COLUMN "workId";
