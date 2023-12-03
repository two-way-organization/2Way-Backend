import { JobStatus, type JobLocation, type ExperienceLevel, type JobType, type JobSalary } from '@prisma/client';

import { prismaClient } from '../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface SearchRequestQuery {
  location?: JobLocation;
  title?: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  skills?: string[];
}

export interface SearchResponseBody {
  jobs: {
    jobId: number;
    title: string;
    companyName: string;
    location: JobLocation;
    startDate: Date;
    salary: JobSalary;
    jobType: JobType;
    experienceLevel: ExperienceLevel;
  }[],
}

export const searchJob = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, SearchRequestQuery, unknown, unknown>, SearchResponseBody>,
) => {
  const { location, title, jobType, experienceLevel, skills } = ctx.request.query;

  const jobs = await prismaClient.job.findMany({
    where: {
      status: JobStatus.Ongoing,
      location,
      title: {
        contains: title,
      },
      experienceLevel: experienceLevel,
      jobType: jobType,
      jobSkill: {
        some: {
          skill: {
            skillName: {
              in: skills,
            }
          },
        },
      },
    }
  });

  ctx.status = 200;
  ctx.body = {
    jobs: await Promise.all(jobs.map(async (job) => ({
      jobId: job.id,
      title: job.title,
      companyName: (await prismaClient.companyInfo.findUnique({
        where: {
          companyId: job.companyId,
        },
      }))!.companyName,
      location: job.location,
      startDate: job.startDate,
      salary: job.salary,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
    }))),
  };
};