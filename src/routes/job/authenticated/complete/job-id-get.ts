import { prismaClient } from '../../../../utils/prisma-client';

import type { Job } from '@prisma/client';
import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface JobCompleteResponseBody {
  message: string;
  data?: Job;
}

export interface JobCompleteRequestParams {
  id: number;
}

export const completeGet = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, JobCompleteRequestParams, unknown, unknown, unknown>, JobCompleteResponseBody>,
) => {
  const { id } = ctx.request.params;

  const checkJobExists = await prismaClient.job.findUnique({
    where: {
      id,
    },
  });

  if (!checkJobExists) {
    ctx.status = 404;
    ctx.body = {
      message: 'Job not found.',
    };
  }

  const job = await prismaClient.job.update({
    where: {
      id,
    },
    data: {
      viewCount: {
        increment: 1,
      },
    }
  });

  ctx.status = 200;
  ctx.body = {
    message: 'Job create completed.',
    data: job,
  };
};
