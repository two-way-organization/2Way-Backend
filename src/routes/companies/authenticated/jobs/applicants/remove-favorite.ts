import { prismaClient } from '../../../../../utils/prisma-client';

import { JwtPayloadState } from '../../../../@types/jwt-payload-state';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface RemoveFavoriteApplicantRequestBody {
  jobId: number;
  applicantId: number;
}

export interface RemoveFavoriteApplicantResponseBody {
  message: string;
}

export const removeFavoriteApplicant = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, RemoveFavoriteApplicantRequestBody, unknown>, RemoveFavoriteApplicantResponseBody>,
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

    if (!checkAlreadyFavorited) {
      ctx.status = 400;
      ctx.body = {
        message: 'Applicant not favorited.',
      };
      return;
    }

    await prismaClient.companyApplicantFavorite.delete({
      where: {
        companyId,
        applicantId,
      },
    });

    ctx.status = 200;
    ctx.body = {
      message: 'Applicant removed from favorites.',
    };
  }
};