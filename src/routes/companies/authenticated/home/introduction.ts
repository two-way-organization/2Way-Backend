import { prismaClient } from '../../../../utils/prisma-client';

import type { ZodContext } from 'koa-zod-router';
import type { ParameterizedContext } from 'koa';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';

export interface IntroductionResponseBody {
  companyName: string;
  introduction: (string | null);
  ceoName: string | null;
  email: string;
}

export interface ErrorResponse {
  message: string;
}

export const introduction = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, IntroductionResponseBody | ErrorResponse>,
) => {
  const { id: companyId, email } = ctx.state.user;

  const company = await prismaClient.company.findUnique({
    where: {
      id: companyId,
      email,
    },
    select: {
      companyName: true,
      ceoName: true,
      email: true,
      companyInfo: true,
    },
  });

  if (company) {
    ctx.status = 200;
    ctx.body = {
      companyName: company.companyName,
      introduction: company.companyInfo?.introduction ?? null,
      ceoName: company.ceoName,
      email: company.email,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      message: 'Company not found.',
    };
  }
};