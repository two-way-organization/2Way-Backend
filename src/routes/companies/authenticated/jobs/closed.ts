import { JobStatus } from '@prisma/client';

import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';

export interface ClosedGetRequestQuery {
  page: number;
  pageSize: number;
}

export interface ErrorResponse {
  message: string;
}

export interface ClosedGetResponse {
  jobs: {
    companyName: string;
    title: string;
    startDate: Date;
    endDate: Date;
    experienceLevel: string;
    educationLevel: string;
    logoImage?: string;
  }[];
  pagination: {
    currentPage: number;
    totalPage: number;
    totalItems: number;
    limit: number;
  };
}

export const closed = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, ClosedGetRequestQuery, unknown, unknown>, ErrorResponse | ClosedGetResponse>,
) => {
  const { id } = ctx.state.user;
  const { page, pageSize } = ctx.request.query;

  const account = await prismaClient.company.findUnique({
    where: {
      id,
    },
  });

  if (!account) {
    ctx.status = 404;
    ctx.body = {
      message: 'Account not found.',
    };
  } else {
    const jobs = await prismaClient.job.findMany({
      where: {
        companyId: account.id,
        status: JobStatus.Closed,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        title: true,
        startDate: true,
        endDate: true,
        experienceLevel: true,
        educationLevel: true,
        company: {
          select: {
            name: true,
            companyInfo: {
              select: {
                logoImage: true,
              },
            },
          },
        },
      },
    });

    const totalItems = await prismaClient.job.count({
      where: {
        companyId: account.id,
      },
    });

    ctx.status = 200;
    ctx.body = {
      jobs: jobs.map((job) => ({
        companyName: job.company.name,
        title: job.title,
        startDate: job.startDate,
        endDate: job.endDate,
        experienceLevel: job.experienceLevel,
        educationLevel: job.educationLevel,
        logoImage: job.company?.companyInfo?.logoImage,
      })),
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(totalItems / pageSize),
        totalItems,
        limit: pageSize,
      },
    };
  }
};