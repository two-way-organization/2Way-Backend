import { prismaClient } from '../../../utils/prisma-client';

import type { Job } from '@prisma/client';
import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface JobModificationResponseBody {
  message: string;
  data?: Job;
}

export interface JobMofiicationRequestParams {
  id: number;
}

export interface JobModificationRequestBody {
  title: string;
  position: string;
  startDate: Date;
  endDate: Date;
  numberOfVacancies: number;
  experienceLevel: 'Newcomer' | 'Experienced' | 'Unspecified';
  experienceYears: string;
  jobType: 'Regular' | 'Contract' | 'Intern';
  contractPeriod: string;
  salary: string;
  location: string;
}

export const jobModification = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, JobMofiicationRequestParams, unknown, JobModificationRequestBody, unknown>, JobModificationResponseBody>,
) => {
  const { id } = ctx.request.params;
  const {
    title,
    position,
    startDate,
    endDate,
    numberOfVacancies,
    experienceLevel,
    experienceYears,
    jobType,
    contractPeriod,
    salary,
    location,
  } = ctx.request.body;

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
      title,
      position,
      startDate,
      endDate,
      numberOfVacancies,
      experienceLevel,
      experienceYears,
      jobType,
      contractPeriod,
      salary,
      location,
    }
  });

  ctx.status = 200;
  ctx.body = {
    message: 'Job get completed.',
    data: job,
  };
};