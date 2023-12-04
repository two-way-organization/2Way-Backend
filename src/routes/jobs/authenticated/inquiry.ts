import { prismaClient } from '../../../utils/prisma-client';

import { JwtPayloadState } from '../../@types/jwt-payload-state';

import { ErrorResponse } from '../../@types/error-response';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { Job } from '@prisma/client';

interface JobInquiryRequestBody {
  jobId: number;
}

interface JobInquiryResponseBody {
  job: Job
}

export const inquiryJob = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, JobInquiryRequestBody, unknown>, ErrorResponse | JobInquiryResponseBody>,
) => {
  const role = ctx.state.user.role;
  const { jobId } = ctx.request.body;

  const job = await prismaClient.job.findUnique({
    where: {
      id: jobId,
    },
    include: {
      company: {
        include: {
          companyInfo: true,
        },
      },
    },
  });

  if (!job) {
    ctx.status = 404;
    ctx.body = {
      message: 'Job not found',
    };
    return;
  }

  if (role === 'applicant') {
    await prismaClient.applicantActivity.create({
      data: {
        viewedAt: new Date(),
        applicant: {
          connect: {
            id: ctx.state.user.id,
          },
        },
        job: {
          connect: {
            id: jobId,
          },
        },
      },
    });
  }

  ctx.status = 200;
  ctx.body = {
    job,
  };

  await prismaClient.job.update({
    where: {
      id: jobId,
    },
    data: {
      viewCount: job.viewCount + 1,
    },
  });
};
