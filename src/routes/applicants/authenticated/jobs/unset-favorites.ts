import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { JwtPayloadState } from '../../../@types/jwt-payload-state';
import type { ErrorResponse } from '../../../@types/error-response';

export interface ApplicantFavoriteRequestBody {
  jobId: number;
}

export interface ApplicantFavoriteResponseBody {
  message: string;
}

export const applicantRemoveJobFavorite = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, ApplicantFavoriteRequestBody, unknown>, ErrorResponse | ApplicantFavoriteResponseBody>,
) => {
  const { id: applicantId } = ctx.state.user;
  const { jobId } = ctx.request.body;


  const existData = await prismaClient.applicantActivity.findUnique({
    where: {
      jobId,
      applicantId,
    },
  });

  if (existData) {
    await prismaClient.applicantActivity.update({
      where: {
        applicantId,
        jobId,
      },
      data: {
        jobFavoritedAt: null,
      },
    });
  }

  ctx.status = 200;
  ctx.body = {
    message: 'Remove favorite job successful.',
  };
};