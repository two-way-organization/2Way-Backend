import { prismaClient } from '../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../@types/jwt-payload-state';

export interface DeactivateResponseBody {
  message: string;
}

export const deregister = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, DeactivateResponseBody>,
) => {
  const { id, email } = ctx.state.user;

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
    await prismaClient.applicant.delete({
      where: {
        id,
      },
    });

    ctx.status = 200;
    ctx.body = {
      message: 'Account successfully deactivated.',
    };
  }
};