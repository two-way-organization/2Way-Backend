import { prismaClient } from '../../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../../@types/jwt-payload-state';

export interface ErrorResponse {
  message: string;
}

export interface SolutionGetResponse {
  companyId: number;
  solutions: {
    solutionId: number;
    solutionName: string;
  }[];
}

export const getSolution = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, ErrorResponse | SolutionGetResponse>,
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
      companyId: account.id,
      solutions: (await prismaClient.companySolution.findMany({
        where: {
          companyId: account.id,
        },
        select: {
          solutionId: true,
          solution: {
            select: {
              solutionName: true,
            },
          },
        },
      })).map((solution) => ({
        solutionId: solution.solutionId,
        solutionName: solution.solution.solutionName,
      })),
    };
  }
};