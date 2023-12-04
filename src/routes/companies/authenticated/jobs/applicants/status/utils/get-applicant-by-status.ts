import { prismaClient } from '../../../../../../../utils/prisma-client';

import type { ApplicationStatus } from '@prisma/client';

export const getApplicantByStatus = async (jobId: number, companyId: number, applicantStatus: ApplicationStatus) => await prismaClient.applicant.findMany({
  where: {
    application: {
      some: {
        jobId,
        status: applicantStatus,
      },
    },
  },
  include: {
    applicantResume: {
      take: 1,
    },
    application: {
      where: {
        jobId,
        status: applicantStatus,
      },
      take: 1,
    },
    companyApplicantFavorite: {
      where: {
        companyId,
      },
      orderBy: {
        favoritedAt: 'desc',
      },
      take: 1,
    },
  },
});