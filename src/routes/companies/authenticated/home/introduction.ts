import { prismaClient } from '../../../../utils/prisma-client';

import type { ZodContext } from 'koa-zod-router';
import type { ParameterizedContext } from 'koa';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';

export interface IntroductionResponseBody {
  companyName: string;
  introduction: (string | null);
  ceoName: string;
}

export interface ErrorResponse {
  message: string;
}

export const introduction = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, IntroductionResponseBody | ErrorResponse>,
) => {
  const { id: companyId } = ctx.state.user;

  const company = await prismaClient.companyInfo.findUnique({
    where: {
      companyId,
    },
    select: {
      companyName: true,
      ceoName: true,
      introduction: true,
    },
  });

  if (!company) {
    ctx.status = 404;
    ctx.body = {
      message: 'Company not found.',
    };
  } else {
    ctx.status = 200;
    ctx.body = {
      companyName: company.companyName,
      introduction: company.introduction,
      ceoName: company.ceoName,
    };
  }
};