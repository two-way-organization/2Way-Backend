import zodRouter from 'koa-zod-router';
import { z } from 'zod';

import { ParameterizedContext } from 'koa';

import { register } from './unauthenticated/register';
import { login } from './unauthenticated/login';
import { deregister } from './authenticated/deregister';
import { inquire } from './authenticated/inquire';
import { modification } from './authenticated/modification';
import { feedbacks } from './authenticated/home/feedbacks';
import { jobs } from './unauthenticated/home/jobs';

import { JwtPayloadState } from '../@types/jwt-payload-state';

export const unauthenticatedApplicantRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/applicants',
    },
  });

  prefixedRouter.put(
    '/',
    register,
    {
      body: z.object({
        fullName: z.string(),
        email: z.string().email(),
        password: z.string(),
      }),
    }
  );

  prefixedRouter.post(
    '/',
    login,
    {
      body: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    }
  );
  
  prefixedRouter.get('/home/jobs', jobs);

  return prefixedRouter;
};

export const authenticatedApplicantRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/applicants',
    },
  });

  prefixedRouter.use(async (ctx: ParameterizedContext<JwtPayloadState>, next) => {
    if (ctx.state.user.role !== 'applicant') {
      ctx.status = 403;
      ctx.body = {
        message: 'Forbidden.',
      };
    }
    await next();
  });

  prefixedRouter.delete('/', deregister);
  prefixedRouter.get('/', inquire);
  prefixedRouter.patch('/', modification, {
    body: z.object({
      fullName: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().optional(),
    }),
  });

  prefixedRouter.get('/home/feedbacks', feedbacks);

  return prefixedRouter;
};