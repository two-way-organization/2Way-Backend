import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';

import type { ZodContext } from 'koa-zod-router';

export interface JobCreateStep1ResponseBody {
  message: string;
  id: number;
}

export interface JobCreateStep1RequestBody {
  companyId: number;
  title: string;
  position: string;
  startDate: Date;
  endDate: Date;
  numberOfVacancies: number;
}

export const step1 = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, unknown, JobCreateStep1RequestBody, unknown>, JobCreateStep1ResponseBody>,
) => {
  const { companyId, title, position, startDate, endDate, numberOfVacancies } = ctx.request.body;

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
