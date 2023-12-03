import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';
import type { CompanyType } from '@prisma/client';
import type { CompanySolutionType } from './types';

export interface CompanyInfoCreateRequestBody {
  profile: {
    registrationNumber: string;
    companyName: string;
    ceoName: string;
    introduction?: string;
    industries: CompanySolutionType[];
    logoImage: string;
    companyType: CompanyType;
    numberOfEmployees: number;
    capital: number;
    establishmentDate: Date;
    mainBusiness: string[];
  };
}

export interface CompanyInfoCreateResponse {
  message: string;
  companyInfoId?: number;
}

export const createInfo = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, CompanyInfoCreateRequestBody, unknown>, CompanyInfoCreateResponse>,
) => {
  const { id, email } = ctx.state.user;
  const { profile } = ctx.request.body;

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
    for await (const industry of profile.industries) {
      await prismaClient.companySolution.create({
        data: {
          companyId: id,
          solutionId: industry.solutionId,
        },
      });
    }

    await prismaClient.companyInfo.create({
      data: {
        company: {
          connect: {
            id: account.id,
          },
        },
        companyName: profile.companyName,
        registrationNumber: profile.registrationNumber,
        ceoName: profile.ceoName,
        introduction: profile.introduction,
        logoImage: profile.logoImage,
        companyType: profile.companyType,
        numberOfEmployees: profile.numberOfEmployees,
        capital: profile.capital,
        establishmentDate: profile.establishmentDate,
        mainBusiness: {
          data: profile.mainBusiness,
        },
      },
    });

    ctx.status = 200;
    ctx.body = {
      message: 'Profile retrieval successful.',
    };
  }
};