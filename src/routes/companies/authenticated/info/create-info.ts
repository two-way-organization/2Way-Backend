import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';
import type { CompanyType } from '@prisma/client';

export interface CompanyInfoCreateRequestBody {
  profile: {
    registrationNumber: string;
    companyName: string;
    ceoName: string;
    introduction?: string;
    logoImage: string;
    companyType: CompanyType;
    numberOfEmployees: number;
    capital: number;
    establishmentDate: string;
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
        establishmentDate: new Date(profile.establishmentDate),
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