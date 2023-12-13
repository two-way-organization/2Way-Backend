import type { ErrorResponse } from '../../../../@types/error-response';
import type { Job } from '@prisma/client';

interface StatusResponseBody {
  applications: {
    applicationId: number;
    job: Job;
    status: string;
    appliedAt: Date;
    updatedAt: Date;
  }[];
}

export type ApplicationStatusResponseBody = ErrorResponse | StatusResponseBody;