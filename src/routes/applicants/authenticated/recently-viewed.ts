import { prismaClient } from '../../../utils/prisma-client';

import type { ZodContext } from 'koa-zod-router';
import type { ParameterizedContext } from 'koa';

import type { JwtPayloadState } from '../../@types/jwt-payload-state';
import type { ErrorResponse } from '../../@types/error-response';
import type { Job } from '@prisma/client';

export interface ApplicantsRecentlyViewedRequestQuery {
  page: number;
  pageSize: number;
}

export interface ApplicantsRecentlyViewedResponseBody {
  jobs: Job[];
  pagination: {
    currentPage: number;
    totalPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const applicantsRecentlyViewed = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, ApplicantsRecentlyViewedRequestQuery, unknown, unknown>, ErrorResponse | ApplicantsRecentlyViewedResponseBody>,
) => {
  const { id: applicantId } = ctx.state.user;
  const { page } = ctx.request.query;

  const pageSize = Math.min(10, Math.max(1, ctx.request.query.pageSize ?? 10));

  // get from ApplicantActivity table
  const applicantActivity = await prismaClient.applicantActivity.findMany({
    where: {
      applicantId,
    },
    orderBy: {
      viewedAt: 'desc',
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const totalItems = await prismaClient.applicantActivity.count({
    where: {
      applicantId,
    },
  });

  const jobIds = applicantActivity.filter((it) => it.jobId).map((activity) => activity.jobId!);
  const jobs = await prismaClient.job.findMany({
    where: {
      id: {
        in: jobIds,
      },
    },
    include: {
      company: {
        include: {
          companyInfo: true,
        }
      },
    },
  });

  ctx.status = 200;
  ctx.body = {
    jobs: jobs,
    pagination: {
      currentPage: page,
      totalPage: Math.ceil(totalItems / pageSize),
      totalItems: totalItems,
      itemsPerPage: pageSize,
    },
  };
};