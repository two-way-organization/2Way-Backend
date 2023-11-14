import { SHA3 } from 'sha3';
import { ParameterizedContext } from 'koa';
import { ZodContext } from 'koa-zod-router';
import jwt from 'jsonwebtoken';

import { prismaClient } from '../../../utils/prisma-client';

import type { Next } from 'koa';

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponseBody {
  message: string;
  token?: string;
}

const invalidEmailOrPassword = {
  code: 401,
  message: 'Invalid email or password.',
};

/**
 * Sign in an applicant using koa-jwt and prisma orm.
 *
 * @example
 * request body:
 * {
 *   "email": "<email address>",
 *   "password": "<password>"
 * }
 *
 * successful response body: (200 ok)
 * {
 *   "message": "Login successful.",
 *   "token": "<jwt token>"
 * }
 *
 * error response body
 * {
 *   "message": "<error message>"
 * }
 *
 * @param ctx
 * @param next
 */
export const login = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, unknown, LoginRequestBody, unknown>, LoginResponseBody>,
  next: Next
) => {
  const { email, password } = ctx.request.body;

  // check password
  const applicant = await prismaClient.applicants.findUnique({
    where: {
      email,
    },
  });

  if (applicant) {
    const hash = new SHA3(512);
    const hashedPassword = hash.update(password).digest('hex');

    if (hashedPassword === applicant.password) {
      ctx.status = 200;
      ctx.body = {
        message: 'Login successful.',
        token: jwt.sign({ id: applicant.id, email: applicant.email }, process.env.JWT_SECRET!, { expiresIn: '1d' }),
      };
      await next();
      return;
    }
  }

  ctx.status = invalidEmailOrPassword.code;
  ctx.body = {
    message: invalidEmailOrPassword.message,
  };
  await next();
};