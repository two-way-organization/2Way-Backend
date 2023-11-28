import { prismaClient } from '../../../utils/prisma-client';

import type { Job, JobStatus } from '@prisma/client';
import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { JwtPayloadState } from '../../@types/jwt-payload-state';

export interface JobChangeStateResponseBody {
  message: string;
  data?: Job;
}

export interface JobChangeStateRequestParams {
  id: number;
}

export interface JobChangeStateRequestBody {
  status: JobStatus,
}

export const jobChangeState = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, JobChangeStateRequestParams, unknown, JobChangeStateRequestBody, unknown>, JobChangeStateResponseBody>,
) => {
  const { id } = ctx.request.params;
  const { status } = ctx.request.body;

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
  } else if (checkJobExists.companyId !== ctx.state.user.id) {
    ctx.status = 403;
    ctx.body = {
      message: 'You are not authorized to modify this job.',
    };
  } else {
    const job = await prismaClient.job.update({
      where: {
        id,
      },
      data: {
        status,
      }
    });

    ctx.status = 200;
    ctx.body = {
      message: 'Job status update completed.',
      data: job,
    };
  }
};
