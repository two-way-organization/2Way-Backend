import { prismaClient } from '../../../../../../utils/prisma-client';

import type { Job, EducationLevel, ExperienceLevel, JobLocation } from '@prisma/client';

export interface ApplicantJob {
  companyName: string;
  title: string;
  startDate: Date;
  endDate: Date;
  experienceLevel: ExperienceLevel;
  location: JobLocation;
  educationLevel: EducationLevel;
  logoImage: string;
}

export const jobsToApplicantJobs = async (jobs: Job[]): Promise<ApplicantJob[]> => {
  return (await Promise.all(jobs.map(async (job) => {
    const companyInfo = await prismaClient.companyInfo.findUnique({
      where: {
        companyId: job.companyId,
      },
    });

    if (companyInfo) {
      return {
        companyName: companyInfo.companyName,
        title: job.title,
        startDate: job.startDate,
        endDate: job.endDate,
        experienceLevel: job.experienceLevel,
        location: job.location,
        educationLevel: job.educationLevel,
        logoImage: companyInfo.logoImage,
      };
    }
  }))).filter((job) => job) as ApplicantJob[];
};