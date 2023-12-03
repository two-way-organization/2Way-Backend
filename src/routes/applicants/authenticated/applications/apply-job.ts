import { prismaClient } from '../../../../utils/prisma-client';

import { JwtPayloadState } from '../../../@types/jwt-payload-state';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface ErrorResponse {
  message: string;
}

export interface JobRequestBody {
  jobId: number;
}

export interface JobResponseBody {
  applicationId: number;
}

export const applyJob = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, JobRequestBody, unknown>, ErrorResponse | JobResponseBody>,
) => {
  const { id: applicantId } = ctx.state.user;
  const { jobId } = ctx.request.body;

  const job = await prismaClient.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    ctx.status = 404;
    ctx.body = {
      message: 'Job not found.',
    };
  } else {
    const application = await prismaClient.application.findUnique({
      where: {
        applicantId,
        jobId,
      },
    });

    if (application) {
      ctx.status = 409;
      ctx.body = {
        message: 'Application already exists.',
      };
    } else {
      const newApplication = await prismaClient.application.create({
        data: {
          applicantId,
          jobId,
        },
      });

      ctx.status = 200;
      ctx.body = {
        applicationId: newApplication.id,
      };
    }
  }
};