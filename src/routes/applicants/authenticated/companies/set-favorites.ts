import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { JwtPayloadState } from '../../../@types/jwt-payload-state';
import type { ErrorResponse } from '../../../@types/error-response';

export interface ApplicantFavoriteRequestBody {
  companyId: number;
}

export interface ApplicantFavoriteResponseBody {
  message: string;
}

export const applicantSetCompanyFavorite = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, ApplicantFavoriteRequestBody, unknown>, ErrorResponse | ApplicantFavoriteResponseBody>,
) => {
  const { id: applicantId } = ctx.state.user;
  const { companyId } = ctx.request.body;


  const existData = await prismaClient.applicantActivity.findUnique({
    where: {
      applicantId,
    },
  });

  if (existData) {
    await prismaClient.applicantActivity.update({
      where: {
        applicantId,
      },
      data: {
        companyId,
        companyFavoritedAt: new Date(),
      },
    });
  } else {
    await prismaClient.applicantActivity.create({
      data: {
        applicantId,
        companyId,
        companyFavoritedAt: new Date(),
      },
    });
  }

  ctx.status = 200;
  ctx.body = {
    message: 'Favorite company successful.',
  };
};