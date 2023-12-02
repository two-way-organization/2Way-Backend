import zodRouter from 'koa-zod-router';
import { z } from 'zod';

import { ParameterizedContext } from 'koa';

import { register } from './unauthenticated/register';
import { login } from './unauthenticated/login';
import { deregister } from './authenticated/deregister';
import { inquire } from './authenticated/inquire';
import { modification } from './authenticated/modification';
import { introduction } from './authenticated/home/introduction';
import { info, create } from './authenticated/info';


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
        name: z.string(),
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

  // 회사 간편프로필 조회
  prefixedRouter.get('/info', info);
  
  // 회사 간편프로필 등록
  prefixedRouter.post('/info', create, {
    body: z.object({
      companyName: z.string(),
      registrationNumber: z.string(),
      ceoName: z.string(),
      introduction: z.string().nullable().optional(),
      industries: z.array(z.object({
        solutionId: z.number()
      })),
      logoImage: z.string(),
      numberOfEmployees: z.number(),
      companyType: z.string(),
      capital: z.string(),
      establishmentDate: z.date(),
      mainBusiness: z.string()
    }),
  });  

  return prefixedRouter;
};