import { prismaClient } from '../../../utils/prisma-client';

import type { Next, ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../@types/jwt-payload-state';

export interface ErrorResponse {
  message: string;
}

export interface InfoResponseBody extends Response {
  profile: {
    id: number;
    companyName: string;
    ceoName: string;
    hrName: string | null;
    businessType: string;
    businessRegistrationNumber: string;
    email: string;
    registrationCertificatePath: string | null;
    certificateVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
}

export const inquire = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, InfoResponseBody | ErrorResponse>,
  next: Next
) => {
  const { id, email } = ctx.state;

  const account = await prismaClient.company.findUnique({
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
        companyName: account.companyName,
        ceoName: account.ceoName,
        hrName: account.hrName,
        businessType: account.businessType,
        businessRegistrationNumber: account.registrationNumber,
        email: account.email,
        registrationCertificatePath: account.registrationCertificatePath,
        certificateVerified: account.certificateVerified,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      }
    };
  }

  await next();
};