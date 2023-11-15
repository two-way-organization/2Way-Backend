import { prismaClient } from '../../../../utils/prisma-client';

import type { Next, ParameterizedContext } from 'koa';

import type { ZodContext } from 'koa-zod-router';

export interface JobsResponseBody {
  jobs: {
    postId: number;
    companyTitle: string;
    jobTitle: string;
    postedAt: Date;
  }[];
}

export const jobs = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, unknown, unknown, unknown>, JobsResponseBody>,
  next: Next,
) => {
  const jobList = await prismaClient.job.findMany({
    select: {
      postId: true,
      company: {
        select: {
          companyName: true,
        },
      },
      title: true,
      createdAt: true,
    },
  });

  const jobs = jobList.map((job) => ({
    postId: job.postId,
    companyTitle: job.company.companyName,
    jobTitle: job.title,
    postedAt: job.createdAt,
  }));

  ctx.status = 200;
  ctx.body = {
    jobs,
  };

  await next();
};


