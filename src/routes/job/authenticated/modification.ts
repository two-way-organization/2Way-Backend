import { prismaClient } from '../../../utils/prisma-client';

import type { Job } from '@prisma/client';
import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { JwtPayloadState } from '../../@types/jwt-payload-state';

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
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, JobMofiicationRequestParams, unknown, JobModificationRequestBody, unknown>, JobModificationResponseBody>,
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
  }
};
