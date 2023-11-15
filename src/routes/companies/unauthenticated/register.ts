import { SHA3 } from 'sha3';

import { prismaClient } from '../../../utils/prisma-client';

import type { Next, ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface RegisterRequestBody {
  companyName: string;
  ceoName: string;
  businessType: string;
  registrationNumber: string;
  email: string;
  password: string;
}

export interface RegisterResponseBody {
  message: string;
  companyId?: number;
}

/**
 * Registers a new applicant.
 *
 * @example
 * request body:
 * {
 *   "email": "<email address>",
 *   "password": "<password>",
 *   "companyName": "<company name>",
 *   "ceoName": "<ceo name>",
 *   "businessType": "<business type>",
 *   "registrationNumber": "<registration number>"
 * }
 * successful response body: (201 created)
 * {
 *   "message": "Registration successful.",
 *   "companyId": "<company id>"
 * }
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
  const { companyName, ceoName, businessType, registrationNumber, email, password } = ctx.request.body;

  const checkAccountExists = await prismaClient.company.findUnique({
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

    const data = await prismaClient.company.create({
      data: {
        email,
        password: hashedPassword,
        companyName,
        ceoName,
        businessType,
        registrationNumber,
      },
    });

    ctx.status = 201;
    ctx.body = {
      message: 'Registration successful.',
      companyId: data.id,
    };
  }
  await next();
};
