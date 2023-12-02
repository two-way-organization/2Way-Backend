import { ApplicantJob, jobsToApplicantJobs } from './utils/jobs-to-applicant-jobs';

import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';

export interface RandomJobsResponseBody {
  jobs: ApplicantJob[];
}

export const recentJobs = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, RandomJobsResponseBody>,
) => {
  // get recent 5 jobs
  const recentJobs = await prismaClient.job.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  if (!recentJobs) {
    ctx.status = 200;
    ctx.body = {
      jobs: [],
    };
  } else {
    ctx.status = 200;

    ctx.body = {
      jobs: await jobsToApplicantJobs(recentJobs),
    };
  }
};