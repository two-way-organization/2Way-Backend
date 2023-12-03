import { prismaClient } from '../../../../../utils/prisma-client';

import { JwtPayloadState } from '../../../../@types/jwt-payload-state';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface AddFavoriteApplicantRequestBody {
  jobId: number;
  applicantId: number;
}

export interface AddFavoriteApplicantResponseBody {
  message: string;
}

export const addFavoriteApplicant = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, AddFavoriteApplicantRequestBody, unknown>, AddFavoriteApplicantResponseBody>,
) => {
  const { id: companyId } = ctx.state.user;
  const { jobId, applicantId } = ctx.request.body;

  const job = await prismaClient.job.findUnique({
    where: {
      id: jobId,
      companyId,
    },
  });

  const applicant = await prismaClient.applicant.findUnique({
    where: {
      id: applicantId,
    },
  });

  if (!job || !applicant) {
    ctx.status = 404;
    ctx.body = {
      message: 'Job or applicant not found.',
    };
  } else {
    const checkAlreadyFavorited = await prismaClient.companyApplicantFavorite.findUnique({
      where: {
        companyId,
        applicantId,
      },
    });

    if (checkAlreadyFavorited) {
      ctx.status = 400;
      ctx.body = {
        message: 'Applicant already favorited.',
      };
      return;
    }

    await prismaClient.companyApplicantFavorite.create({
      data: {
        companyId,
        applicantId,
      },
    });

    ctx.status = 201;
    ctx.body = {
      message: 'Applicant favorited successfully.',
    };
  }
};
