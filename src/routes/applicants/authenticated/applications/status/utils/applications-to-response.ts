import type { getApplicationByStatus } from './get-application-by-status';

export const applicationsToResponse = (applications: Awaited<ReturnType<typeof getApplicationByStatus>>) => applications.map((application) => ({
  applicationId: application.id,
  job: application.job,
  status: application.status,
  appliedAt: application.appliedAt,
  updatedAt: application.updatedAt,
}));