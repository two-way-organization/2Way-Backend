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
    companyName: string;
    ceoName: string | null;
    hrName: string | null;
    businessRegistrationNumber: string;
    email: string;
    companyCertification: {
      id: number;
      companyId: number;
      registrationNumber: string | null;
      registrationCertificatePath: string | null;
      certificateVerified: boolean;
    }[] | null;
    createdAt: Date;
    updatedAt: Date;
  }
}

export const inquire = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, InfoResponseBody | ErrorResponse>,
) => {
  const { id, email } = ctx.state.user;

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
    const cert = await prismaClient.companyCertification.findMany({
      where: {
        companyId: id,
      },
    });
    
    ctx.status = 200;
    ctx.body = {
      message: 'Profile retrieval successful.',
      profile: {
        id: account.id,
        companyName: account.companyName,
        ceoName: account.ceoName,
        hrName: account.hrName,
        businessRegistrationNumber: account.registrationNumber,
        email: account.email,
        companyCertification: cert ?? null,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      }
    };
  }
};