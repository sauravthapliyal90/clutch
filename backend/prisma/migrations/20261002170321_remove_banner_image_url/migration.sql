/*
  Warnings:

  - You are about to drop the column `bannerImageUrl` on the `Meet` table. All the data in the column will be lost.
  - Added the required column `bannerImageKey` to the `Meet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meet" DROP COLUMN "bannerImageUrl",
ADD COLUMN     "bannerImageKey" TEXT NOT NULL;
