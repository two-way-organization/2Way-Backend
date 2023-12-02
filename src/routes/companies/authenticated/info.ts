import { prismaClient } from '../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../@types/jwt-payload-state';
import { CompanyType } from '@prisma/client';

function mapToCompanyType(type: string): CompanyType | undefined {
  switch (type) {
      case '중소기업': return CompanyType.SmallBusiness;
      case '중견기업': return CompanyType.MediumEnterprise;
      case '대기업': return CompanyType.Enterprise;
      default: return undefined;
  }
}

export interface ErrorResponse {
  message: string;
}

interface CompanySolutionType {
  solutionId: number;
}

export interface InfoResponseBody extends Response {
  profile?: {
    companyName: string;
    registrationNumber: string;
    ceoName: string;
    introduction: string | null;
    industries: CompanySolutionType[];
    logoImage: string;
    numberOfEmployees: number;
    companyType: string;
    capital: string;
    establishmentDate: Date;
    mainBusiness:  string;
  }
}

interface CompanyInfoRequestBody {
  companyName: string;
  registrationNumber: string;
  ceoName: string;
  introduction: string | null;
  industries: CompanySolutionType[];
  logoImage: string;
  numberOfEmployees: number;
  companyType: string;
  capital: string;
  establishmentDate: Date;
  mainBusiness: string;
}

export const info = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, InfoResponseBody | ErrorResponse>,
) => {
  const { id: companyId } = ctx.state.user;

  const company = await prismaClient.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      companyInfo: true,
      companySolution: {
        include: {
          solution: true,
        },
      },
    },
  });

  if (!company || !company.companyInfo) {
    ctx.status = 404;
    ctx.body = { message: 'Company information not found.' };
    return;
  }

  ctx.status = 200;
  ctx.body = {
    message: 'Profile retrieval successful.',
    profile: {
      companyName: company.companyInfo.companyName,
      registrationNumber: company.companyInfo.registrationNumber,
      ceoName: company.companyInfo.ceoName,
      introduction: company.companyInfo.introduction,
      industries: company.companySolution.map(cs => ({
        solutionId: cs.solution.id,
      })),
      logoImage: company.companyInfo.logoImage,
      numberOfEmployees: company.companyInfo.numberOfEmployees,
      companyType: company.companyInfo.companyType,
      capital: company.companyInfo.capital,
      establishmentDate: company.companyInfo.establishmentDate,
      mainBusiness: company.companyInfo.mainBusiness,
    }
  };
};

export const create = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, InfoResponseBody | ErrorResponse>,
) => {
  const { id: companyId } = ctx.state.user;
  
  const {
    companyName,
    registrationNumber,
    ceoName,
    introduction,
    industries,
    logoImage,
    numberOfEmployees,
    companyType,
    capital,
    establishmentDate,
    mainBusiness,
  } = ctx.request.body as CompanyInfoRequestBody;

  const mappedCompanyType = mapToCompanyType(companyType);
  
  if (!mappedCompanyType) {
    ctx.status = 400;
    ctx.body = { message: 'Invalid company type.' };
    return;
  }

  const newCompanyInfo = await prismaClient.companyInfo.create({
    data: {
      companyId,
      companyName,
      registrationNumber,
      ceoName,
      introduction,
      logoImage,
      numberOfEmployees,
      companyType: mappedCompanyType,
      capital,
      establishmentDate,
      mainBusiness,
    },
  });
  
  await Promise.all(
    industries.map(({ solutionId }) =>
      prismaClient.companySolution.create({
        data: {
          companyId,
          solutionId,
        },
      })
    )
  );
  
  ctx.status = 201;
  ctx.body = {
    message: 'Profile creation successful.',
    profile: {
      companyName: newCompanyInfo.companyName,
      registrationNumber: newCompanyInfo.registrationNumber,
      ceoName: newCompanyInfo.ceoName,
      introduction: newCompanyInfo.introduction,
      industries: industries.map(cs => ({
        solutionId: cs.solutionId,
      })),
      logoImage: newCompanyInfo.logoImage,
      numberOfEmployees: newCompanyInfo.numberOfEmployees,
      companyType: newCompanyInfo.companyType,
      capital: newCompanyInfo.capital,
      establishmentDate: newCompanyInfo.establishmentDate,
      mainBusiness: newCompanyInfo.mainBusiness,
    }
  };
};
