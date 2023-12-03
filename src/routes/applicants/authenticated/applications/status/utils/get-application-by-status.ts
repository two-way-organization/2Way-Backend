import { ApplicationStatus } from '@prisma/client';

import { prismaClient } from '../../../../../../utils/prisma-client';

export const getApplicationByStatus = async (
  applicantId: number,
  status: ApplicationStatus,
) => await prismaClient.application.findMany({
  where: {
    applicantId,
    status: status,
  },
  orderBy: {
    updatedAt: 'desc',
  },
  select: {
    id: true,
    jobId: true,
    status: true,
    appliedAt: true,
    updatedAt: true,
  }
});