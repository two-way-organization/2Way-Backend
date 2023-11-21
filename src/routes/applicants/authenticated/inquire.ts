import { prismaClient } from '../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../@types/jwt-payload-state';

export interface ErrorResponse {
  message: string;
}

export interface InfoResponseBody extends Response {
  profile: {
    id: number;
    fullName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const inquire = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, InfoResponseBody | ErrorResponse>,
) => {
  const { id, email } = ctx.state;

  const account = await prismaClient.applicant.findUnique({
    where: {
      id,
      email,
    },
  });

  if (!account) {
    ctx.status = 404;
    ctx.body = {
      message: 'Account not found.',
    };
  } else {
    ctx.status = 200;
    ctx.body = {
      message: 'Profile retrieval successful.',
      profile: {
        id: account.id,
        fullName: account.fullName,
        email: account.email,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
    };
  }
};