import {
  JobStatus,
  type JobLocation,
  type ExperienceLevel,
  type JobType,
  type EducationLevel,
  type Job
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
  page: string;
  pageSize: string;
}

export interface SearchResponseBody {
  jobs: Job[],
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
  const pageSize = Math.min(10, Math.max(1, parseInt(ctx.request.query.pageSize)));

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
    skip: (parseInt(page) - 1) * pageSize,
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
    jobs,
    pagination: {
      currentPage: parseInt(page),
      totalPage,
      totalItems,
      itemsPerPage: pageSize,
    }
  };
};