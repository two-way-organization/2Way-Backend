import { prismaClient } from '../../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../../@types/jwt-payload-state';

export interface CompanySolutionCreateRequestBody {
  solutions: string[];
}

export interface CompanySolutionCreateResponse {
  message: string;
  companyInfoId?: number;
}

export const createSolution = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, CompanySolutionCreateRequestBody, unknown>, CompanySolutionCreateResponse>,
) => {
  const { id, email } = ctx.state.user;
  const { solutions } = ctx.request.body;

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
    // create solutions
    for (const solution of solutions) {
      const solutionData = await prismaClient.solution.create({
        data: {
          solutionName: solution,
        },
      });
      await prismaClient.companySolution.create({
        data: {
          companyId: account.id,
          solutionId: solutionData.id,
        },
      });
    }

    ctx.status = 200;
    ctx.body = {
      message: 'Solution created successful.',
    };
  }
};