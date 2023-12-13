/*
  Warnings:

  - A unique constraint covering the columns `[applicantId,jobId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Application_applicantId_jobId_key` ON `Application`(`applicantId`, `jobId`);
