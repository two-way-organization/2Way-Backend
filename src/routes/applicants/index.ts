import zodRouter from 'koa-zod-router';
import { z } from 'zod';

import { register } from './unauthenticated/register';
import { login } from './unauthenticated/login';
import { deregister } from './authenticated/deregister';

export const unauthenticatedApplicantRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/applicants',
    },
  });

  prefixedRouter.post(
    '/register',
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
    '/login',
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

  prefixedRouter.delete('/deregister', deregister);

  return prefixedRouter;
};