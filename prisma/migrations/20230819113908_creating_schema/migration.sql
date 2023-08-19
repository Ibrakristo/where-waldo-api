/*
  Warnings:

  - You are about to drop the `leaderboard` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `finishedAt` DATETIME(3) NULL;

-- DropTable
DROP TABLE `leaderboard`;

-- CreateIndex
CREATE INDEX `User_createdAt_finishedAt_idx` ON `User`(`createdAt`, `finishedAt`);
