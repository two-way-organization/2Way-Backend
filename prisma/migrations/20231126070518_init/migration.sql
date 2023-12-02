CREATE TABLE `Applicant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Applicant_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ApplicantResume` (
    `applicantId` INTEGER NOT NULL,
    `gitHubId` VARCHAR(191) NOT NULL,
    `educationLevel` ENUM('HighSchoolGraduate', 'AssociateDegree', 'BachelorsDegree', 'MastersOrDoctorate', 'EducationNotRequired') NOT NULL,
    `schoolName` VARCHAR(191) NOT NULL,
    `major` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `birth` DATETIME(3) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `experienceLevel` ENUM('Newcomer', 'Experienced', 'Unspecified') NOT NULL,
    `totalExperience` INTEGER  NULL,
    `companyName` VARCHAR(191)  NULL,
    `duties` VARCHAR(191)  NULL,

    UNIQUE INDEX `ApplicantResume_applicantId_key`(`applicantId`),
    PRIMARY KEY (`applicantId`),
    FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    UNIQUE INDEX `Company_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Solution` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `solutionName` VARCHAR(50) NOT NULL,
    
    PRIMARY KEY (`id`),
    UNIQUE `SolutionName` (`solutionName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CompanySolution` (
    `companyId` INTEGER NOT NULL,
    `solutionId` INTEGER NOT NULL,

    PRIMARY KEY (`companyId`, `solutionId`),
    FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`solutionId`) REFERENCES `Solution`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CompanyInfo` (
    `companyId` INTEGER NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `ceoName` VARCHAR(191) NOT NULL,
    `introduction` VARCHAR(191) NULL,
    `logoImage` VARCHAR(191) NOT NULL,
    `companyType` ENUM('SmallBusiness', 'MediumEnterprise', 'Enterprise') NOT NULL,
    `numberOfEmployees` INTEGER NOT NULL,
    `capital` VARCHAR(191) NOT NULL,
    `establishmentDate` DATE NOT NULL,
    `mainBusiness` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`companyId`),
    FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE INDEX `CompanyInfo_companyId_key`(`companyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Job` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,   
    `numberOfVacancies` INTEGER NOT NULL DEFAULT 1,
    `experienceLevel` ENUM('Newcomer', 'Experienced', 'Unspecified') NOT NULL,
    `educationLevel` ENUM( 'HighSchoolGraduate', 'AssociateDegree', 'BachelorsDegree', 'MastersOrDoctorate', 'EducationNotRequired' ) NOT NULL,
    `jobType` ENUM('Regular', 'Intern', 'ConversionIntern', 'Contract') NOT NULL,
    `salary` ENUM('DecisionAfterTheInterview', 'AccordingToCompanyPolicy') NOT NULL,
    `location` ENUM( 'Seoul', 'Gyeonggi', 'Incheon', 'Daejeon', 'Sejong', 'Chungnam', 'Chungbuk', 'Gwangju', 'Jeonnam', 'Jeonbuk', 'Daegu', 'Gyeongbuk', 'Busan', 'Ulsan', 'Gyeongnam', 'Gangwon', 'Jeju' ) NOT NULL,
    `recruitmentImage` VARCHAR(191) NOT NULL,
    `jobIntroduction` VARCHAR(191) NULL,
    `responsibilities` VARCHAR(191) NULL,
    `qualificationRequirements` VARCHAR(191) NULL,
    `preferentialTreatment` VARCHAR(191) NULL,
    `hiringProcess` VARCHAR(191) NULL,
    `personalStatementQuestion`  VARCHAR(191) NOT NULL,
    `requiredDocuments` VARCHAR(191) NOT NULL,
    `status` ENUM('Ongoing', 'Closed') NOT NULL DEFAULT 'Ongoing',
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `applicationCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

CREATE TABLE `Application` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `applicantId` INT NOT NULL,
    `jobId` INT NOT NULL,
    `status` ENUM('Waiting', 'Success', 'Failed') NOT NULL DEFAULT 'Waiting',
    `result` ENUM('Submitted', 'Reviewing', 'Interview', 'Rejected'),
    `appliedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`),
    FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`),
    FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ApplicationQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicationId` INTEGER NOT NULL,
    `applicantResponse` VARCHAR(191) NOT NULL,
    `summarizedResponse` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ApplicationFile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicationId` INTEGER NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `uploadTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ApplicantActivity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicantId` INTEGER NOT NULL,
    `jobId` INTEGER,
    `companyId` INTEGER,
    `viewedAt` DATETIME(3),
    `jobFavoritedAt` DATETIME(3),
    `companyFavoritedAt` DATETIME(3),

    PRIMARY KEY (`id`),
    FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`),
    FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`),
    FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `CompanyApplicantFavorite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `applicantId` INTEGER NOT NULL,
    `favoritedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`),
    FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skillName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE `SkillName` (`skillName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Position` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `positionName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE `positionName` (`positionName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `JobPosition` (
    `jobId` INTEGER NOT NULL,
    `positionId` INTEGER NOT NULL,

    PRIMARY KEY (`jobId`, `positionId`),
    FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`positionId`) REFERENCES `Position`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `JobSkill` (
    `jobId` INTEGER NOT NULL,
    `skillId` INTEGER NOT NULL,

    PRIMARY KEY (`jobId`, `skillId`),
    FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;