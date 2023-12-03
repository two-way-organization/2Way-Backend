import { prismaClient } from '../../../utils/prisma-client';

import type { ZodContext } from 'koa-zod-router';
import type { ParameterizedContext } from 'koa';

import type { JwtPayloadState } from '../../@types/jwt-payload-state';
import type { ErrorResponse } from '../../@types/error-response';

export interface ApplicationsSavedCompanyRequestQuery {
  page: number;
  pageSize: number;
}

export interface ApplicationsSavedCompanyResponseBody {
  company: {
    companyId: number;
    companyName: string;
    logoImage: string;
  }[];
  pagination: {
    currentPage: number;
    totalPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const applicationsSavedCompany = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, ApplicationsSavedCompanyRequestQuery, unknown, unknown>, ErrorResponse | ApplicationsSavedCompanyResponseBody>,
) => {
  const { id: applicantId } = ctx.state.user;
  const { page } = ctx.request.query;
  const pageSize = Math.min(10, Math.max(1, ctx.request.query.pageSize));

  const applicantActivity = await prismaClient.applicantActivity.findMany({
    where: {
      applicantId,
    },
    orderBy: {
      companyFavoritedAt: 'desc',
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const totalItems = await prismaClient.applicantActivity.count({
    where: {
      applicantId,
    },
  });

  const companyIds = applicantActivity.filter((it) => it.companyId).map((activity) => activity.companyId!);
  const companies = await prismaClient.company.findMany({
    where: {
      id: {
        in: companyIds,
      },
    },
    include: {
      companyInfo: true,
    },
  });

  ctx.status = 200;
  ctx.body = {
    company: companies.map((company) => ({
      companyId: company.id,
      companyName: company.name,
      logoImage: company.companyInfo!.logoImage,
    })),
    pagination: {
      currentPage: page,
      totalPage: Math.ceil(totalItems / pageSize),
      totalItems,
      itemsPerPage: pageSize,
    },
  };
};