-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_challengeId_fkey";

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
