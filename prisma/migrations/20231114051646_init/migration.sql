-- CreateTable
CREATE TABLE "Language" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Applicant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "companyName" TEXT NOT NULL,
    "ceoName" TEXT NOT NULL,
    "hrName" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "registrationCertificatePath" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ApplicantToLanguage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ApplicantToLanguage_A_fkey" FOREIGN KEY ("A") REFERENCES "Applicant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ApplicantToLanguage_B_fkey" FOREIGN KEY ("B") REFERENCES "Language" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_email_key" ON "Applicant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_registrationNumber_key" ON "Company"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicantToLanguage_AB_unique" ON "_ApplicantToLanguage"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicantToLanguage_B_index" ON "_ApplicantToLanguage"("B");
