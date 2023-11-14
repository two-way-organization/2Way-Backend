import { SHA3 } from 'sha3';

import { prismaClient } from '../../../utils/prisma-client';

import type { Next, ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface RegisterRequestBody {
  fullName: string;
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
 *   "full_name": "<full name>",
 *   "email": "<email address>",
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
 * @param next
 */
export const register = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, unknown, RegisterRequestBody, unknown>, RegisterResponseBody>,
  next: Next
) => {
  const { fullName, email, password } = ctx.request.body;

  // password to sha3
  const hash = new SHA3(512);
  const hashedPassword = hash.update(password).digest('hex');

  const data = await prismaClient.applicants.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
    },
  });

  ctx.status = 201;
  ctx.body = {
    message: 'Registration successful.',
    applicantId: data.id,
  };
  await next();
};
