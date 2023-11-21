import { prismaClient } from '../../../../utils/prisma-client';

import type { ZodContext } from 'koa-zod-router';
import type { ParameterizedContext } from 'koa';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';

export interface IntroductionResponseBody {
  companyName: string;
  introduction: (string | null)[];
  ceoName: string;
  phoneNumber: (string | null)[];
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
      companyProfiles: true,
    },
  });

  if (company) {
    ctx.status = 200;
    ctx.body = {
      companyName: company.companyName,
      introduction: company.companyProfiles.map((profile) => profile.introduction),
      ceoName: company.ceoName,
      phoneNumber: company.companyProfiles.map((profile) => profile.phoneNumber),
      email: company.email,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      message: 'Company not found.',
    };
  }
};