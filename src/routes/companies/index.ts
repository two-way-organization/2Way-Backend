import zodRouter from 'koa-zod-router';
import { z } from 'zod';

import { register } from './unauthenticated/register';
import { login } from './unauthenticated/login';
import { deregister } from './authenticated/deregister';
import { inquire } from './authenticated/inquire';
import { modification } from './authenticated/modification';

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