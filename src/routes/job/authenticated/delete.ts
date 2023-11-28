import { prismaClient } from '../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { JwtPayloadState } from '../../@types/jwt-payload-state';

export interface JobDeleteResponseBody {
  message: string;
}

export interface JobDeleteRequestParams {
  id: number;
}

export const jobDelete = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, JobDeleteRequestParams, unknown, unknown, unknown>, JobDeleteResponseBody>,
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
  } else if (checkJobExists.companyId !== ctx.state.user.id) {
    ctx.status = 403;
    ctx.body = {
      message: 'You are not authorized to delete this job.',
    };
  } else {
    await prismaClient.job.delete({
      where: {
        id,
      },
    });

    ctx.status = 200;
    ctx.body = {
      message: 'Job delete completed.',
    };
  }
};
