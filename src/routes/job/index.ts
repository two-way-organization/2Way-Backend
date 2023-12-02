import zodRouter from 'koa-zod-router';
import { z } from 'zod';

import { searchJob } from './authenticated/search';

export const unauthenticatedJobRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/jobs',
    },
  });

  prefixedRouter.get('/search', searchJob, {
    query: z.object({
      location: z.enum(['Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju', 'Daejeon', 'Ulsan', 'Sejong', 'Gyeonggi', 'Gangwon', 'Chungbuk', 'Chungnam', 'Jeonbuk', 'Jeonnam', 'Gyeongbuk', 'Gyeongnam', 'Jeju']),
      title: z.string(),
      jobType: z.enum(['Regular', 'Contract', 'Intern']),
      experienceLevel: z.enum(['Newcomer', 'Experienced', 'Unspecified']),
      skills: z.array(z.string()),
    }),
  });

  return prefixedRouter;
};

export const authenticatedJobRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/jobs',
    },
  });

  return prefixedRouter;
};