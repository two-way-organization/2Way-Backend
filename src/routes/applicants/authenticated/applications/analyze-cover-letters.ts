import { prismaClient } from '../../../../utils/prisma-client';

import { JwtPayloadState } from '../../../@types/jwt-payload-state';

import { improveSentence } from '../../../../utils/improve-sentence';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { ErrorResponse } from '../../../@types/error-response';

export interface AnalyzeCoverLettersRequestParams {
  applicationId: string;
}

export interface AnalyzeCoverLettersResponseBody {
  questions: {
    personalStatementQuestion: string;
    applicantResponse: string;
    analyzedResponse: {
      original: string;
      reason: string;
      improved: string;
    }[];
  }[];
}

export const analyzeCoverLetters = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, AnalyzeCoverLettersRequestParams, unknown, unknown, unknown>, ErrorResponse | AnalyzeCoverLettersResponseBody>,
) => {
  const { id: applicantId } = ctx.state.user;
  const { applicationId: stringApplicationId } = ctx.request.params;
  const applicationId = parseInt(stringApplicationId);

  const application = await prismaClient.application.findUnique({
    where: {
      id: applicationId,
      applicantId,
    },
  });

  if (!application) {
    ctx.status = 404;
    ctx.body = {
      message: 'Not found.',
    };
  } else {
    const question = await prismaClient.applicationQuestion.findMany({
      where: {
        applicationId,
      },
    });

    const job = await prismaClient.job.findUnique({
      where: {
        id: application.jobId,
      },
    });

    if (!question || !job) {
      ctx.status = 404;
      ctx.body = {
        message: 'Not found.',
      };
    } else {
      const personalStatementQuestions = (job.personalStatementQuestion as { data: string[] }).data;

      ctx.status = 200;
      ctx.body = {
        questions: await Promise.all(question.map(async (question, index) => {
          return {
            personalStatementQuestion: personalStatementQuestions[index],
            applicantResponse: question.applicantResponse,
            analyzedResponse: await improveSentence(personalStatementQuestions[index], question.applicantResponse),
          };
        })),
      };
    }
  }
};

