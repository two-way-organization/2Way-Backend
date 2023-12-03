import { prismaClient } from '../../../../utils/prisma-client';

import { JwtPayloadState } from '../../../@types/jwt-payload-state';

import { summarizeDocument } from '../../../../utils/summary';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

export interface CreateCoverLettersRequestParams {
  applicationId: number;
}

export interface CreateCoverLettersRequestBody {
  questions: {
    applicantResponse: string;
  }[];
}

export interface CreateCoverLettersResponseBody {
  message: string;
  fileId?: number;
  questionIds?: number[];
}

export const createCoverLetters = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, CreateCoverLettersRequestParams, unknown, CreateCoverLettersRequestBody, unknown>, CreateCoverLettersResponseBody>,
) => {
  const { id: applicantId } = ctx.state.user;
  const { applicationId } = ctx.request.params;
  const { questions } = ctx.request.body;

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
    const questionsData = await Promise.all(questions.map(async (question) => {
      return await prismaClient.applicationQuestion.create({
        data: {
          application: {
            connect: {
              id: applicationId,
            },
          },
          applicantResponse: question.applicantResponse,
          summarizedResponse: await summarizeDocument(question.applicantResponse),
        },
      });
    }));

    ctx.status = 200;
    ctx.body = {
      message: 'Cover letter created successfully.',
      questionIds: questionsData.map((question) => question.questionId),
    };
  }
};