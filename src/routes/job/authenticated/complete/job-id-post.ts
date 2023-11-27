import { JobStatus } from '@prisma/client';

import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface JobCompleteResponseBody {
  message: string;
  id?: number;
}

export interface JobCompleteRequestParams {
  id: number;
}

export const completePost = async (
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
      status: JobStatus.Ongoing,
    }
  });

  ctx.status = 200;
  ctx.body = {
    message: 'Job create completed.',
    id: job.id,
  };
};
