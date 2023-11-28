import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface JobCreateStep5ResponseBody {
  message: string;
  id?: number;
}

export interface JobCreateStep5RequestBody {
  id: number;
  detail: {
    personalStatementQuestions: string;
    requiredDocuments: string;
  };
}

export const step5 = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, unknown, JobCreateStep5RequestBody, unknown>, JobCreateStep5ResponseBody>,
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
    return;
  } else if (checkJobExists.companyId !== ctx.state.user.id) {
    ctx.status = 403;
    ctx.body = {
      message: 'You are not authorized to update this job.',
    };
    return;
  }

  const job = await prismaClient.job.update({
    where: {
      id,
    },
    data: {
      jobTopicDetails: {
        create: [
          {
            topic: 'personalStatementQuestions',
            detail: detail.personalStatementQuestions,
            itemOrder: 7,
          },
          {
            topic: 'requiredDocuments',
            detail: detail.requiredDocuments,
            itemOrder: 8,
          },
        ],
      },
    }
  });

  ctx.status = 200;
  ctx.body = {
    message: 'Job step5 updated successfully.',
    id: job.id,
  };
};
