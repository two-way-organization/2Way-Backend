import { prismaClient } from '../../../../utils/prisma-client';

import type { JobStatus } from '@prisma/client';

import type { ZodContext } from 'koa-zod-router';
import type { ParameterizedContext } from 'koa';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';

export interface ErrorResponse {
  message: string;
}

export interface StatusRequestBody {
  jobId: number;
  status: JobStatus;
}

export interface StatusResponseBody {
  jobId: number;
}

export const statusJob = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, StatusRequestBody, unknown>, ErrorResponse | StatusResponseBody>,
) => {
  const { id: companyId } = ctx.state.user;
  const { jobId, status } = ctx.request.body;

  const job = await prismaClient.job.findUnique({
    where: {
      id: jobId,
      companyId,
    },
  });

  if (!job) {
    ctx.status = 404;
    ctx.body = {
      message: 'Job not found.',
    };
  } else {
    await prismaClient.job.update({
      where: {
        id: jobId,
      },
      data: {
        status,
      },
    });

    ctx.status = 200;
    ctx.body = {
      jobId,
    };
  }
};