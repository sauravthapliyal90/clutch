/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "imageUrl",
ADD COLUMN     "imageKey" TEXT;
