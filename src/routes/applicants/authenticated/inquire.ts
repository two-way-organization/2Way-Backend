import { prismaClient } from '../../../utils/prisma-client';

import type { Next, ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../@types/jwt-payload-state';

export interface InfoResponseBody {
  id: number;
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ErrorResponse {
  message: string;
}

export const inquire = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, InfoResponseBody | ErrorResponse>,
  next: Next
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
      id: account.id,
      fullName: account.fullName,
      email: account.email,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  await next();
};