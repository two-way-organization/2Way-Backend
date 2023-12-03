import { prismaClient } from '../../../../utils/prisma-client';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';
import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface DeleteRequestParams {
  applicationId: number;
}

export interface DeleteResponseBody {
  message: string;
}

export const deleteApplication = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, DeleteRequestParams, unknown, unknown, unknown>, DeleteResponseBody>,
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
    await prismaClient.application.delete({
      where: {
        id: applicationId,
      },
    });

    ctx.status = 200;
    ctx.body = {
      message: 'Application deletion successful.',
    };
  }
};