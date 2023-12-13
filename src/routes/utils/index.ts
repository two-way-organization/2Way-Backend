import zodRouter from 'koa-zod-router';
import { z } from 'zod';

import { githubLanguageUsage } from './authenticated/github-language-usage';
import { solvedAcTier } from './authenticated/solved-ac-tier';
import { roadAddress } from './authenticated/road-address';
import { postSpellCheck } from './authenticated/spell-check';

export const authenticatedUtilsRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/utils',
    },
  });

  prefixedRouter.post(
    '/github-language-usage',
    githubLanguageUsage,
    {
      body: z.object({
        githubUsername: z.string(),
      }),
    }
  );
  prefixedRouter.post(
    '/solved-ac-tier',
    solvedAcTier,
    {
      body: z.object({
        solvedAcUsername: z.string(),
      }),
    }
  );
  prefixedRouter.post(
    '/road-address',
    roadAddress,
    {
      body: z.object({
        keyword: z.string(),
        currentPage: z.number(),
        countPerPage: z.number(),
      }),
    }
  );
  prefixedRouter.post(
    '/spell-check',
    postSpellCheck,
    {
      body: z.object({
        text: z.string(),
      }),
    }
  );

  return prefixedRouter;
};