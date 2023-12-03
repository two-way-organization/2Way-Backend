-- AlterTable
ALTER TABLE `application` MODIFY `status` ENUM('Waiting', 'Preferred', 'Success', 'Failed') NOT NULL DEFAULT 'Waiting';
