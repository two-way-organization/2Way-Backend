import {
  JobStatus,
  type JobLocation,
  type ExperienceLevel,
  type JobType,
  type JobSalary,
  type EducationLevel
} from '@prisma/client';

import { prismaClient } from '../../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface SearchRequestQuery {
  location?: JobLocation;
  title?: string;
  position?: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  educationLevel?: EducationLevel;
  skills?: string[];
  page: number;
  pageSize: number;
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
  pagination: {
    currentPage: number;
    totalPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const searchJob = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, SearchRequestQuery, unknown, unknown>, SearchResponseBody>,
) => {
  const { location, title, position, jobType, experienceLevel, educationLevel, skills, page } = ctx.request.query;
  const pageSize = Math.min(10, Math.max(1, ctx.request.query.pageSize));

  // pagination
  const jobs = await prismaClient.job.findMany({
    where: {
      status: JobStatus.Ongoing,
      location,
      title: {
        contains: title,
      },
      jobPosition: {
        some: {
          position: {
            positionName: {
              contains: position,
            },
          },
        },
      },
      experienceLevel: experienceLevel,
      educationLevel: educationLevel,
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
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      company: {
        include: {
          companyInfo: true,
        }
      }
    },
  });
  const totalItems = await prismaClient.job.count({
    where: {
      status: JobStatus.Ongoing,
      location,
      title: {
        contains: title,
      },
      jobPosition: {
        some: {
          position: {
            positionName: {
              contains: position,
            },
          },
        },
      },
      experienceLevel: experienceLevel,
      educationLevel: educationLevel,
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
    },
  });
  const totalPage = Math.ceil(totalItems / pageSize);

  ctx.status = 200;
  ctx.body = {
    jobs: jobs.map((job) => ({
      jobId: job.id,
      title: job.title,
      companyName: job.company.companyInfo?.companyName ?? 'Unknown',
      location: job.location,
      startDate: job.startDate,
      salary: job.salary,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
    })),
    pagination: {
      currentPage: page,
      totalPage,
      totalItems,
      itemsPerPage: pageSize,
    }
  };
};