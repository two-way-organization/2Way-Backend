import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';
import type { ApplicantResume, Applicant } from '@prisma/client';
import type { ErrorResponse } from '../../../@types/error-response';

export interface InfoResponseBody {
  profile: ApplicantResume & {
    applicant: Omit<Applicant, 'password'>,
  };
}

export const inquire = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, InfoResponseBody | ErrorResponse>,
) => {
  const { id } = ctx.state.user;

  const account = await prismaClient.applicantResume.findUnique({
    where: {
      applicantId: id,
    },
    include: {
      applicant: true,
    },
  });

  if (!account) {
    ctx.status = 404;
    ctx.body = {
      message: 'Resume not found',
    };
  } else {
    ctx.status = 200;
    ctx.body = {
      message: 'Profile retrieval successful.',
      profile: {
        ...account,
        applicant: Object.fromEntries(
          Object.entries(account.applicant).filter(([key]) => key !== 'password')
        ) as Omit<Applicant, 'password'>,
      },
    };
  }
};