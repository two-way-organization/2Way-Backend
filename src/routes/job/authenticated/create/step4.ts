import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface JobCreateStep4ResponseBody {
  message: string;
  id?: number;
}

export interface JobCreateStep4RequestBody {
  id: number;
  detail: {
    hiringProcess: string;
  };
}

export const step4 = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, unknown, JobCreateStep4RequestBody, unknown>, JobCreateStep4ResponseBody>,
) => {
  const { id, detail } = ctx.request.body;

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
      jobTopicDetails: {
        create: [
          {
            topic: 'hiringProcess',
            detail: detail.hiringProcess,
            itemOrder: 6,
          },
        ],
      },
    }
  });

  ctx.status = 200;
  ctx.body = {
    message: 'Job step4 updated successfully.',
    id: job.id,
  };
};
