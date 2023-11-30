import { SHA3 } from 'sha3';

import { prismaClient } from '../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponseBody {
  message: string;
  applicantId?: number;
}

/**
 * Registers a new applicant.
 *
 * @example
 * request body:
 * {
 *   "name": "<name>",
 *   "email": "<email>",
 *   "password": "<password>",
 * }
 *
 * successful response body:
 * {
 *   "message": "Registration successful.",
 *   "applicantId": "<applicant ID>"
 * }
 *
 * error response body:
 * {
 *   "message": "<error message>"
 * }
 *
 * @param ctx
 */
export const register = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, unknown, RegisterRequestBody, unknown>, RegisterResponseBody>,
) => {
  const { name, email, password } = ctx.request.body;

  const checkAccountExists = await prismaClient.applicant.findUnique({
    where: {
      email,
    },
  });
  if (checkAccountExists) {
    ctx.status = 409;
    ctx.body = {
      message: 'Account already exists.',
    };
  } else {

    // password to sha3
    const hash = new SHA3(512);
    const hashedPassword = hash.update(password).digest('hex');

    const data = await prismaClient.applicant.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    ctx.status = 201;
    ctx.body = {
      message: 'Registration successful.',
      applicantId: data.id,
    };
  }
};
