/*
  Warnings:

  - You are about to drop the column `finishedAt` on the `user` table. All the data in the column will be lost.
  - Added the required column `totalTime` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_createdAt_finishedAt_idx` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `finishedAt`,
    ADD COLUMN `totalTime` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `User_totalTime_idx` ON `User`(`totalTime`);
