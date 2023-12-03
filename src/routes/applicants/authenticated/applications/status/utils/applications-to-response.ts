import type { getApplicationByStatus } from './get-application-by-status';

export const applicationsToResponse = (applications: Awaited<ReturnType<typeof getApplicationByStatus>>) => applications.map((application) => ({
  applicationId: application.id,
  jobId: application.jobId,
  status: application.status,
  appliedAt: application.appliedAt,
  updatedAt: application.updatedAt,
}));