CREATE TABLE `Applicant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX `Applicant_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ApplicantResume` (
    `id` INTEGER AUTO_INCREMENT,
    `applicantId` INTEGER NOT NULL,
    `gitHubId` VARCHAR(191) NOT NULL,
    `educationLevel` ENUM('HighSchoolGraduate', 'AssociateDegree', 'BachelorsDegree', 'MastersOrDoctorate', 'EducationNotRequired') NOT NULL,
    `schoolName` VARCHAR(191) NOT NULL,
    `major` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `birth` DATETIME NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `totalExperience` INTEGER  NULL,
    `companyName` VARCHAR(191)  NULL,
    `duties` VARCHAR(191)  NULL,

    UNIQUE INDEX `ApplicantResume_applicantId_key`(`applicantId`),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX `Company_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Solution` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `SolutionName` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
)

CREATE TABLE `CompanySolution` (
    `companyId` INTEGER NOT NULL,
    `solutionId` INTEGER NOT NULL,

    PRIMARY KEY (`companyId`, `solutionId`),
    FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`solutionId`) REFERENCES `SolutionType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE TABLE `CompanyInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `registrationNumber` INTEGER NOT NULL,
    `ceoName` VARCHAR(191) NOT NULL,
    `introduction` VARCHAR(191) NULL,
    `logoUrl` VARCHAR(191) NOT NULL,
    `companyType` VARCHAR(191) NOT NULL,
    `numberOfEmployees` INTEGER NOT NULL,
    `capital` DECIMAL(65, 30) NOT NULL,
    `establishmentDate` DATETIME NOT NULL,
    `mainBusiness` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CompanyInfo_companyId_key`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Job` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `startDate` DATETIME NOT NULL,
    `endDate` DATETIME NOT NULL,   
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
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicantId` INT NOT NULL,
    `jobId` INTEGER NOT NULL,
    `status` ENUM('submitted', 'reviewing', 'interview', 'rejected') NOT NULL,
    `appliedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`),
    FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ApplicationQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicationId` INTEGER NOT NULL,
    `originalQuestion` VARCHAR(191) NOT NULL,
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
    `uploadTime` DATETIME NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`applicationId`) REFERENCES `Application`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ApplicantActivity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `applicantId` INTEGER NOT NULL,
    `jobId` INTEGER,
    `companyId` INTEGER,
    `viewedAt` DATETIME,
    `jobFavoritedAt` DATETIME,
    `companyFavoritedAt` DATETIME,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`),
    FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`),
    FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


CREATE TABLE `CompanyApplicantFavorite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `applicantId` INTEGER NOT NULL,
    `favoritedAt` DATETIME NOT NULL,

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