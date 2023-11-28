import { prismaClient } from '../../../utils/prisma-client';

import type { Job } from '@prisma/client';
import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface JobAllGetResponseBody {
  message: string;
  data?: Job[];
}

export const jobAllInquire = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, unknown, unknown, unknown>, JobAllGetResponseBody>,
) => {
  const checkJobExists = await prismaClient.job.findMany();

  if (!checkJobExists) {
    ctx.status = 404;
    ctx.body = {
      message: 'Job not found.',
    };
  }

  const jobs = await prismaClient.job.findMany();

  ctx.status = 200;
  ctx.body = {
    message: 'All Job get completed.',
    data: jobs,
  };
};
