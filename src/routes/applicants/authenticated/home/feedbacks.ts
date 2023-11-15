import { prismaClient } from '../../../../utils/prisma-client';

import type { Next, ParameterizedContext } from 'koa';

import type { ZodContext } from 'koa-zod-router';

export interface FeedbacksResponseBody {
  feedbacks: {
    feedbackId: number;
    comment: string;
    createdAt: Date;
  }[];
}

export const feedbacks = async (
  ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, unknown, unknown, unknown>, FeedbacksResponseBody>,
  next: Next,
) => {
  await next();
};
