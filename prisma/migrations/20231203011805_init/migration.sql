/*
  Warnings:

  - You are about to drop the column `industries` on the `companyinfo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[applicantId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jobId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `companyinfo` DROP COLUMN `industries`;

-- CreateIndex
CREATE UNIQUE INDEX `Application_applicantId_key` ON `Application`(`applicantId`);

-- CreateIndex
CREATE UNIQUE INDEX `Application_jobId_key` ON `Application`(`jobId`);
