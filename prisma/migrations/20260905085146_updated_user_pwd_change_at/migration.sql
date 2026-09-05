/*
  Warnings:

  - You are about to drop the column `pwChangeAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "pwChangeAt",
ADD COLUMN     "pwdChangedAt" TIMESTAMP(3);
