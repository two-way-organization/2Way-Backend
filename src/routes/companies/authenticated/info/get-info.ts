import { prismaClient } from '../../../../utils/prisma-client';

import type { CompanySolutionType } from './types';
import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';
import type { CompanyType } from '@prisma/client';

export interface ErrorResponse {
  message: string;
}

export interface InfoResponseBody {
  profile: {
    companyId: number;
    registrationNumber: string;
    ceoName: string;
    introduction: string | null;
    industries: CompanySolutionType[];
    logoImage: string;
    companyType: CompanyType;
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
    include: {
      company: {
        select: {
          companySolution: true,
        },
      },
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
        industries: account.company.companySolution.map((solution) => ({
          solutionId: solution.solutionId,
        })),
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