import { ApplicationStatus } from '@prisma/client';

import { getApplicantByStatus } from './utils/get-applicant-by-status';

import { applicantsToResponse } from './utils/applicants-to-response';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { CompaniesStatusRequestParams, CompaniesStatusResponseBody } from './types';
import type { JwtPayloadState } from '../../../../../@types/jwt-payload-state';

export const failedCompanies = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, CompaniesStatusRequestParams, unknown, unknown, unknown>, CompaniesStatusResponseBody>,
) => {
  const { id: companyId } = ctx.state.user;
  const { jobId } = ctx.request.params;

  // applicants by status
  const applicants = await getApplicantByStatus(jobId, companyId, ApplicationStatus.Failed);

  if (!applicants) {
    ctx.status = 404;
    ctx.body = {
      message: 'Applicants not found.',
    };
  } else {
    ctx.status = 200;
    ctx.body = {
      applicants: applicantsToResponse(applicants),
    };
  }
};