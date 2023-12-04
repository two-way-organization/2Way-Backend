import { ApplicantJob, jobsToApplicantJobs } from './utils/jobs-to-applicant-jobs';

import { prismaClient } from '../../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { Job } from '@prisma/client';
import type { JwtPayloadState } from '../../../../@types/jwt-payload-state';

export interface RandomJobsResponseBody {
  jobs: ApplicantJob[];
}

export const randomJobs = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, RandomJobsResponseBody>,
) => {
  // get random 5 jobs
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const randomJobs = (await prismaClient.$queryRawUnsafe(
    'SELECT * FROM "Job" ORDER BY RANDOM() LIMIT 5;',
  )) as Job[];

  if (!randomJobs) {
    ctx.status = 200;
    ctx.body = {
      jobs: [],
    };
  } else {
    ctx.status = 200;

    ctx.body = {
      jobs: await jobsToApplicantJobs(randomJobs),
    };
  }
};