import { prismaClient } from '../../../../utils/prisma-client';

import { JwtPayloadState } from '../../../@types/jwt-payload-state';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface DeleteResponse {
  message: string;
}

export interface DeleteRequestBody {
  jobId: number;
}

export const deleteJob = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, DeleteRequestBody, unknown>, DeleteResponse>,
) => {
  const { id: companyId } = ctx.state.user;
  const { jobId } = ctx.request.body;

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
    await prismaClient.job.delete({
      where: {
        id: jobId,
      },
    });

    ctx.status = 200;
    ctx.body = {
      message: 'Job deleted successfully.',
    };
  }
};