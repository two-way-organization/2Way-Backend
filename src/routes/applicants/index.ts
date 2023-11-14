import zodRouter, { ZodContext } from 'koa-zod-router';
import { z } from 'zod';

import { register, type RegisterRequestBody, type RegisterResponseBody } from './unauthenticated/register';
import { login, type LoginRequestBody, type LoginResponseBody } from './unauthenticated/login';
import { deactivate, type DeactivateResponseBody } from './authenticated/deactivate';

import type { ParameterizedContext } from 'koa';
import type { JwtPayloadState } from '../@types/jwt-payload-state';

export const unauthenticatedApplicantRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/applicants',
    },
  });

  prefixedRouter.post(
    '/register',
    async (
      ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, unknown, RegisterRequestBody, unknown>, RegisterResponseBody>,
      next,
    ) => register(ctx, next),
    {
      body: z.object({
        fullName: z.string(),
        email: z.string().email(),
        password: z.string(),
      }),
    }
  );

  prefixedRouter.post(
    '/login',
    async (
      ctx: ParameterizedContext<unknown, ZodContext<unknown, unknown, unknown, LoginRequestBody, unknown>, LoginResponseBody>,
      next,
    ) => login(ctx, next),
    {
      body: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    }
  );

  return prefixedRouter;
};

export const authenticatedApplicantRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/applicants',
    },
  });

  prefixedRouter.delete(
    '/deactivate',
    async (
      ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, unknown, unknown>, DeactivateResponseBody>,
      next
    ) => deactivate(ctx, next));

  return prefixedRouter;
};