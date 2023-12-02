import { SHA3 } from 'sha3';

import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';

export interface ModificationRequestBody {
  name?: string;
  email?: string;
  password?: string;
}

export interface ModificationResponseBody {
  message: string;
  applicantId?: number;
}

export const modification = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, ModificationRequestBody, unknown>, ModificationResponseBody>,
) => {
  const { name, email, password } = ctx.request.body;

  if (!name || !email || !password) {
    ctx.status = 400;
    ctx.body = {
      message: 'Missing required field(s).',
    };
  } else {
    let hashedPassword: string | undefined;
    if (password) {
      // password to sha3
      const hash = new SHA3(512);
      hashedPassword = hash.update(password).digest('hex');
    }

    await prismaClient.applicant.update({
      where: {
        id: ctx.state.user.id,
      },
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    ctx.status = 200;
    ctx.body = {
      message: 'Account successfully updated.',
    };
  }
};
