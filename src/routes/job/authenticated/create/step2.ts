import { prismaClient } from '../../../../utils/prisma-client';

import type { ExperienceLevel, JobType } from '@prisma/client';
import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface JobCreateStep2ResponseBody {
  message: string;
  id?: number;
}

export interface JobCreateStep2RequestBody {
  id: number;
  experienceLevel: ExperienceLevel;
  experienceYears: string;
  jobType: JobType;
  contractPeriod: string;
  salary: string;
  location: string;
  detail: {
    responsibilities: string;
    qualificationRequirements: string;
  };
}

export const step2 = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, unknown, JobCreateStep2RequestBody, unknown>, JobCreateStep2ResponseBody>,
) => {
  const { id, experienceLevel, experienceYears, jobType, contractPeriod, salary, location, detail } = ctx.request.body;

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
      experienceLevel,
      experienceYears,
      jobType,
      contractPeriod,
      salary,
      location,
      jobTopicDetails: {
        create: [
          {
            topic: 'responsibilities',
            detail: detail.responsibilities,
            itemOrder: 1,
          },
          {
            topic: 'qualificationRequirements',
            detail: detail.qualificationRequirements,
            itemOrder: 2,
          },
        ],
      },
    }
  });

  ctx.status = 200;
  ctx.body = {
    message: 'Job step2 updated successfully.',
    id: job.id,
  };
};
