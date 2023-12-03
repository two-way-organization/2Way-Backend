import type { getApplicantByStatus } from './get-applicant-by-status';

export const applicantsToResponse = (applicants: Awaited<ReturnType<typeof getApplicantByStatus>>) => applicants.map((applicant) => {
  const applicationResume = applicant.applicantResume[0];

  return ({
    applicantId: applicant.id,
    name: applicant.name,
    gender: applicationResume.gender,
    birth: applicationResume.birth,
    educationLevel: applicationResume.educationLevel,
    appliedAt: applicant.application[0].appliedAt,
    status: applicant.application[0].status,
    favorited: !!applicant.companyApplicantFavorite[0].favoritedAt,
  });
});