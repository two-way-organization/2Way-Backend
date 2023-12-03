-- CreateTable
CREATE TABLE `Applicant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Applicant_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicantResume` (
    `applicantId` INTEGER NOT NULL,
    `gitHubId` VARCHAR(191) NOT NULL,
    `educationLevel` ENUM('HighSchoolGraduate', 'AssociateDegree', 'BachelorsDegree', 'MastersOrDoctorate', 'EducationNotRequired') NOT NULL,
    `schoolName` VARCHAR(191) NOT NULL,
    `major` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `birth` DATETIME(3) NOT NULL,
    `experienceLevel` ENUM('Newcomer', 'Experienced', 'Unspecified') NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `totalExperience` INTEGER NULL,
    `companyName` VARCHAR(191) NULL,
    `duties` VARCHAR(191) NULL,

    UNIQUE INDEX `ApplicantResume_applicantId_key`(`applicantId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Application` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicantId` INTEGER NOT NULL,
    `jobId` INTEGER NOT NULL,
    `status` ENUM('Waiting', 'Success', 'Failed') NOT NULL DEFAULT 'Waiting',
    `result` ENUM('Submitted', 'Reviewing', 'Interview', 'Rejected') NULL,
    `appliedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationQuestion` (
    `questionId` INTEGER NOT NULL AUTO_INCREMENT,
    `applicationId` INTEGER NOT NULL,
    `applicantResponse` VARCHAR(191) NOT NULL,
    `summarizedResponse` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`questionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationFile` (
    `fileId` INTEGER NOT NULL AUTO_INCREMENT,
    `applicationId` INTEGER NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `uploadTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`fileId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicantActivity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicantId` INTEGER NOT NULL,
    `jobId` INTEGER NULL,
    `companyId` INTEGER NULL,
    `applicationId` INTEGER NULL,
    `viewedAt` DATETIME(3) NULL,
    `jobFavoritedAt` DATETIME(3) NULL,
    `companyFavoritedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Company_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyInfo` (
    `companyId` INTEGER NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `ceoName` VARCHAR(191) NOT NULL,
    `introduction` VARCHAR(191) NULL,
    `industries` JSON NOT NULL,
    `logoImage` LONGTEXT NOT NULL,
    `companyType` ENUM('SmallBusiness', 'MediumEnterprise', 'Enterprise') NOT NULL,
    `numberOfEmployees` INTEGER NOT NULL,
    `capital` DECIMAL(65, 30) NOT NULL,
    `establishmentDate` DATETIME(3) NOT NULL,
    `mainBusiness` JSON NOT NULL,

    UNIQUE INDEX `CompanyInfo_companyId_key`(`companyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Solution` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `solutionName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanySolution` (
    `companyId` INTEGER NOT NULL,
    `solutionId` INTEGER NOT NULL,

    PRIMARY KEY (`companyId`, `solutionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Job` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `numberOfVacancies` INTEGER NOT NULL DEFAULT 1,
    `experienceLevel` ENUM('Newcomer', 'Experienced', 'Unspecified') NOT NULL,
    `educationLevel` ENUM('HighSchoolGraduate', 'AssociateDegree', 'BachelorsDegree', 'MastersOrDoctorate', 'EducationNotRequired') NOT NULL,
    `jobType` ENUM('Regular', 'Intern', 'ConversionIntern', 'Contract') NOT NULL,
    `salary` ENUM('DecisionAfterTheInterview', 'AccordingToCompanyPolicy') NOT NULL,
    `location` ENUM('Seoul', 'Gyeonggi', 'Incheon', 'Daejeon', 'Sejong', 'Chungnam', 'Chungbuk', 'Gwangju', 'Jeonnam', 'Jeonbuk', 'Daegu', 'Gyeongbuk', 'Busan', 'Ulsan', 'Gyeongnam', 'Gangwon', 'Jeju') NOT NULL,
    `recruitmentImage` LONGTEXT NOT NULL,
    `jobIntroduction` VARCHAR(191) NULL,
    `responsibilities` VARCHAR(191) NULL,
    `qualificationRequirements` VARCHAR(191) NULL,
    `preferentialTreatment` VARCHAR(191) NULL,
    `hiringProcess` VARCHAR(191) NULL,
    `personalStatementQuestion` VARCHAR(191) NOT NULL,
    `requiredDocuments` VARCHAR(191) NOT NULL,
    `status` ENUM('Ongoing', 'Closed') NOT NULL DEFAULT 'Ongoing',
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `applicationCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Job_id_companyId_key`(`id`, `companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobTopicDetails` (
    `jobId` INTEGER NOT NULL,
    `companyId` INTEGER NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `detail` VARCHAR(191) NULL,
    `itemOrder` INTEGER NOT NULL,
    `responsibilities` VARCHAR(191) NULL,
    `qualificationRequirements` VARCHAR(191) NULL,

    PRIMARY KEY (`jobId`, `companyId`, `topic`, `itemOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyApplicantFavorite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `applicantId` INTEGER NOT NULL,
    `favoritedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skillName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Skill_skillName_key`(`skillName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Position` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `positionName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Position_positionName_key`(`positionName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobPosition` (
    `jobId` INTEGER NOT NULL,
    `positionId` INTEGER NOT NULL,

    PRIMARY KEY (`jobId`, `positionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobSkill` (
    `jobId` INTEGER NOT NULL,
    `skillId` INTEGER NOT NULL,

    PRIMARY KEY (`jobId`, `skillId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ApplicantResume` ADD CONSTRAINT `ApplicantResume_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationQuestion` ADD CONSTRAINT `ApplicationQuestion_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationFile` ADD CONSTRAINT `ApplicationFile_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicantActivity` ADD CONSTRAINT `ApplicantActivity_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicantActivity` ADD CONSTRAINT `ApplicantActivity_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicantActivity` ADD CONSTRAINT `ApplicantActivity_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicantActivity` ADD CONSTRAINT `ApplicantActivity_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyInfo` ADD CONSTRAINT `CompanyInfo_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanySolution` ADD CONSTRAINT `Company_CompanySolution_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanySolution` ADD CONSTRAINT `CompanySolution_solutionId_fkey` FOREIGN KEY (`solutionId`) REFERENCES `Solution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Job` ADD CONSTRAINT `Job_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobTopicDetails` ADD CONSTRAINT `JobTopicDetails_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobTopicDetails` ADD CONSTRAINT `JobTopicDetails_jobId_companyId_fkey` FOREIGN KEY (`jobId`, `companyId`) REFERENCES `Job`(`id`, `companyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyApplicantFavorite` ADD CONSTRAINT `CompanyApplicantFavorite_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyApplicantFavorite` ADD CONSTRAINT `CompanyApplicantFavorite_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobPosition` ADD CONSTRAINT `JobPosition_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobPosition` ADD CONSTRAINT `JobPosition_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobSkill` ADD CONSTRAINT `JobSkill_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobSkill` ADD CONSTRAINT `JobSkill_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
