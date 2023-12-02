import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';

export interface ErrorResponse {
  message: string;
}

export interface InfoResponseBody {
  profile: {
    companyId: number;
    registrationNumber: string;
    ceoName: string;
    introduction: string | null;
    industries: string[];
    logoImage: string;
    companyType: string;
    numberOfEmployees: number;
    capital: number;
    establishmentDate: Date;
    mainBusiness: string[];
  }
}

export const getInfo = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, InfoResponseBody | ErrorResponse>,
) => {
  const { id } = ctx.state.user;

  const account = await prismaClient.companyInfo.findUnique({
    where: {
      companyId: id,
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
        companyId: account.companyId,
        registrationNumber: account.registrationNumber,
        ceoName: account.ceoName,
        introduction: account.introduction,
        industries: (account.industries as { data: string[] }).data,
        logoImage: account.logoImage,
        companyType: account.companyType,
        numberOfEmployees: account.numberOfEmployees,
        capital: account.capital.toNumber(),
        establishmentDate: account.establishmentDate,
        mainBusiness: (account.mainBusiness as { data: string[] }).data,
      }
    };
  }
};