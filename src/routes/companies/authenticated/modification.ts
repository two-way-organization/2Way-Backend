import { SHA3 } from 'sha3';

import { prismaClient } from '../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../@types/jwt-payload-state';

export interface ModificationRequestBody {
  companyName?: string,
  email?: string,
  password?: string,
}

export interface ModificationResponseBody {
  message: string;
  companyId?: number;
}

export const modification = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, ModificationRequestBody, unknown>, ModificationResponseBody>,
) => {
  const { companyName, email, password } = ctx.request.body;

  if (!companyName && !email && !password) {
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

    await prismaClient.company.update({
      where: {
        id: ctx.state.user.id,
      },
      data: {
        name: companyName,
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
