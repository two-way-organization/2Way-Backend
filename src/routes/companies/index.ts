import zodRouter from 'koa-zod-router';
import { z } from 'zod';

import { ParameterizedContext } from 'koa';

import { register } from './unauthenticated/register';
import { login } from './unauthenticated/login';
import { deregister } from './authenticated/deregister';
import { inquire } from './authenticated/inquire';
import { modification } from './authenticated/modification';
import { introduction } from './authenticated/home/introduction';

import { JwtPayloadState } from '../@types/jwt-payload-state';

export const unauthenticatedCompanyRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/companies',
    },
  });

  prefixedRouter.put(
    '/',
    register,
    {
      body: z.object({
        email: z.string().email(),
        password: z.string(),
        companyName: z.string(),
        ceoName: z.string(),
        businessType: z.string(),
        registrationNumber: z.string(),
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

  return prefixedRouter;
};

export const authenticatedCompanyRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/companies',
    },
  });

  prefixedRouter.use(async (ctx: ParameterizedContext<JwtPayloadState>, next) => {
    if (ctx.state.user.role !== 'company') {
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
      companyName: z.string().optional(),
      hrName: z.string().optional(),
      password: z.string().optional(),
    }),
  });
  prefixedRouter.get('/home/introduction', introduction);

  return prefixedRouter;
};