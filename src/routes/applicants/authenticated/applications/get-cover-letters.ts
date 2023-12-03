import { prismaClient } from '../../../../utils/prisma-client';

import { JwtPayloadState } from '../../../@types/jwt-payload-state';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { ErrorResponse } from '../../../@types/error-response';

export interface GetCoverLettersRequestParams {
  applicationId: number;
}

export interface GetCoverLettersResponseBody {
  questions: {
    personalStatementQuestion?: string;
    applicantResponse: string;
    summarizedResponse: string;
  }[];
}

export const getCoverLetters = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, GetCoverLettersRequestParams, unknown, unknown, unknown>, ErrorResponse | GetCoverLettersResponseBody>,
) => {
  const { id: applicantId } = ctx.state.user;
  const { applicationId } = ctx.request.params;

  const account = await prismaClient.applicant.findUnique({
    where: {
      id: applicantId,
    },
  });

  const application = await prismaClient.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (!account || !application) {
    ctx.status = 404;
    ctx.body = {
      message: 'Not found.',
    };
  } else {
    const questions = await prismaClient.applicationQuestion.findMany({
      where: {
        applicationId,
      },
    });

    const job = await prismaClient.job.findUnique({
      where: {
        id: application.jobId,
      },
    });

    if (!job) {
      ctx.status = 404;
      ctx.body = {
        message: 'Job not found.',
      };
      return;
    }

    const personalStatementQuestions = (job.personalStatementQuestion as { data: string[] })?.data;

    ctx.status = 200;
    ctx.body = {
      questions: questions.map((question, index) => ({
        personalStatementQuestion: personalStatementQuestions[index],
        applicantResponse: question.applicantResponse,
        summarizedResponse: question.summarizedResponse,
      })),
    };
  }
};