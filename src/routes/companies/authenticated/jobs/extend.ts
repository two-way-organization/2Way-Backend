import { prismaClient } from '../../../../utils/prisma-client';

import { JwtPayloadState } from '../../../@types/jwt-payload-state';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { ErrorResponse } from '../../../@types/error-response';

export interface ExtendJobRequestBody {
  jobId: number;
  endDate: string;
}

export interface ExtendJobResponseBody {
  jobId: number;
  endDate: Date;
}

export const extendJob = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, ExtendJobRequestBody, unknown>, ErrorResponse | ExtendJobResponseBody>,
) => {
  const { id: companyId } = ctx.state.user;
  const { jobId, endDate } = ctx.request.body;

  const job = await prismaClient.job.findUnique({
    where: {
      id: jobId,
      companyId: companyId,
    },
    select: {
      companyId: true,
    },
  });

  if (!job) {
    ctx.status = 404;
    ctx.body = {
      message: 'Job not found.',
    };
  } else {
    const newData = await prismaClient.job.update({
      where: {
        id: jobId,
      },
      data: {
        endDate: new Date(endDate),
      },
    });

    ctx.status = 200;
    ctx.body = {
      jobId,
      endDate: newData.endDate,
    };
  }
};