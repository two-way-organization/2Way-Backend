import { ApplicationStatus } from '@prisma/client';

import { getApplicationByStatus } from './utils/get-application-by-status';

import { applicationsToResponse } from './utils/applications-to-response';

import { JwtPayloadState } from '../../../../@types/jwt-payload-state';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { ApplicationStatusResponseBody } from './types';

export const waitingApplications = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, ApplicationStatusResponseBody>,
) => {
  const { id: applicantId } = ctx.state.user;
  const applications = await getApplicationByStatus(applicantId, ApplicationStatus.Waiting);

  if (!applications) {
    ctx.status = 404;
    ctx.body = {
      message: 'Applications not found.',
    };
  } else {
    ctx.status = 200;
    ctx.body = {
      message: 'Applications retrieval successful.',
      applications: applicationsToResponse(applications),
    };
  }
};