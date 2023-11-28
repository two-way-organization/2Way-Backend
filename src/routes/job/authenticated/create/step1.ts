import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';

import type { ZodContext } from 'koa-zod-router';
import { JwtPayloadState } from '../../../@types/jwt-payload-state';

export interface JobCreateStep1ResponseBody {
  message: string;
  id: number;
}

export interface JobCreateStep1RequestBody {
  title: string;
  position: string;
  startDate: Date;
  endDate: Date;
  numberOfVacancies: number;
}

export const step1 = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, JobCreateStep1RequestBody, unknown>, JobCreateStep1ResponseBody>,
) => {
  const { title, position, startDate, endDate, numberOfVacancies } = ctx.request.body;
  const { id: companyId } = ctx.state.user;

  const job = await prismaClient.job.create({
    data: {
      companyId,
      title,
      position,
      startDate,
      endDate,
      numberOfVacancies,
      jobSkill: {
        create: [],
      },
    }
  });

  ctx.status = 200;
  ctx.body = {
    message: 'Job step1 created successfully.',
    id: job.id,
  };
};
