import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { JwtPayloadState } from '../../../@types/jwt-payload-state';
import type { ErrorResponse } from '../../../@types/error-response';

export interface ApplicantFavoriteRequestBody {
  companyId: number;
  applicantId: number;
}

export interface ApplicantFavoriteResponseBody {
  message: string;
}

export const applicantRemoveCompanyFavorite = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, ApplicantFavoriteRequestBody, unknown>, ErrorResponse | ApplicantFavoriteResponseBody>,
) => {
  const { companyId, applicantId } = ctx.request.body;


  const existData = await prismaClient.applicantActivity.findUnique({
    where: {
      companyId,
      applicantId,
    },
  });

  if (existData) {
    await prismaClient.applicantActivity.update({
      where: {
        applicantId,
        companyId,
      },
      data: {
        companyFavoritedAt: null,
      },
    });
  }

  ctx.status = 200;
  ctx.body = {
    message: 'Remove favorite company successful.',
  };
};