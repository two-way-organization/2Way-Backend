import zodRouter from 'koa-zod-router';
import { z } from 'zod';

import { register } from './unauthenticated/register';
import { login } from './unauthenticated/login';
import { deregister } from './authenticated/deregister';
import { inquire } from './authenticated/inquire';
import { modification } from './authenticated/modification';

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

  return prefixedRouter;
};

export const authenticatedApplicantRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/applicants',
    },
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

  return prefixedRouter;
};