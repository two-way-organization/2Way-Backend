import { prismaClient } from '../../../../utils/prisma-client';

import type { ApplicantResume, Application, ApplicationQuestion } from '@prisma/client';

import type { ZodContext } from 'koa-zod-router';
import type { ParameterizedContext } from 'koa';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';
import type { ErrorResponse } from '../../../@types/error-response';

export interface ApplicationsDetailsParams {
  applicationId: number;
}

export interface ApplicationsDetailsResponseBody {
  application: Application;
  resume: ApplicantResume | null;
  questions: ApplicationQuestion[];
}

export const applicationsDetails = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, ApplicationsDetailsParams, unknown, unknown, unknown>, ErrorResponse | ApplicationsDetailsResponseBody>,
) => {
  const { id: applicantId } = ctx.state.user;
  const { applicationId } = ctx.request.params;
  const application = await prismaClient.application.findUnique({
    where: {
      id: applicationId,
      applicantId,
    },
  });

  if (!application) {
    ctx.status = 404;
    ctx.body = {
      message: 'Application not found.',
    };
  } else {
    ctx.status = 200;
    ctx.body = {
      application,
      resume: await prismaClient.applicantResume.findUnique({
        where: {
          applicantId,
        },
      }),
      questions: await prismaClient.applicationQuestion.findMany({
        where: {
          applicationId,
        },
      }),
    };
  }
};
