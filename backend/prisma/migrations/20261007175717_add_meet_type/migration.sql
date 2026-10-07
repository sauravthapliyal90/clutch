-- CreateEnum
CREATE TYPE "MeetType" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Meet" ADD COLUMN     "meetType" "MeetType" NOT NULL DEFAULT 'PUBLIC';
