import type { EducationLevel } from '@prisma/client';
import type { ErrorResponse } from '../../../../../@types/error-response';

export interface CompaniesStatusRequestParams {
  jobId: number;
}

interface StatusResponseBody {
  applicants: {
    applicantId: number;
    name: string;
    gender: string;
    birth: Date;
    educationLevel: EducationLevel;
    appliedAt: Date;
    status: string;
    favorited: boolean;
  }[];
}

export type CompaniesStatusResponseBody = ErrorResponse | StatusResponseBody;