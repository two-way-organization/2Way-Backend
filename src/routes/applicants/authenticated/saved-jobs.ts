import { prismaClient } from '../../../utils/prisma-client';

import type { Job } from '@prisma/client';

import type { ZodContext } from 'koa-zod-router';
import type { ParameterizedContext } from 'koa';

import type { JwtPayloadState } from '../../@types/jwt-payload-state';
import type { ErrorResponse } from '../../@types/error-response';

export interface ApplicationsSavedJobsRequestQuery {
  page: number;
  pageSize: number;
  sort: 'recent' | 'deadline';
}

export interface ApplicationsSavedJobsResponseBody {
  jobs: Job[];
  pagination: {
    currentPage: number;
    totalPage: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const applicationsSavedJobs = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, ApplicationsSavedJobsRequestQuery, unknown, unknown>, ErrorResponse | ApplicationsSavedJobsResponseBody>,
) => {
  const { id: applicantId } = ctx.state.user;
  const { page, sort: sortType } = ctx.request.query;
  const pageSize = Math.min(10, Math.max(1, ctx.request.query.pageSize));

  const sort = sortType === 'recent' ? 'desc' : 'asc';
  const applicantActivity = await prismaClient.applicantActivity.findMany({
    where: {
      applicantId,
    },
    orderBy: {
      jobFavoritedAt: sort,
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
      }
    },
  });

  ctx.status = 200;
  ctx.body = {
    jobs,
    pagination: {
      currentPage: page,
      totalPage: Math.ceil(totalItems / pageSize),
      totalItems,
      itemsPerPage: pageSize,
    },
  };
};