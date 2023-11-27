import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface JobCreateStep3ResponseBody {
  message: string;
  id?: number;
}

export interface JobCreateStep3RequestBody {
  id: number;
  companyIntroduction: string;
  detail: {
    welfareBenefits: string;
    notice: string;
    note: string;
  };
}

export const step3 = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, unknown, JobCreateStep3RequestBody, unknown>, JobCreateStep3ResponseBody>,
) => {
  const { id, companyIntroduction, detail } = ctx.request.body;

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
      companyIntroduction,
      jobTopicDetails: {
        create: [
          {
            topic: 'welfareBenefits',
            detail: detail.welfareBenefits,
            itemOrder: 3,
          },
          {
            topic: 'notice',
            detail: detail.notice,
            itemOrder: 4,
          },
          {
            topic: 'note',
            detail: detail.note,
            itemOrder: 5,
          },
        ],
      },
    }
  });

  ctx.status = 200;
  ctx.body = {
    message: 'Job step3 updated successfully.',
    id: job.id,
  };
};
