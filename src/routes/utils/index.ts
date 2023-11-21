import zodRouter from 'koa-zod-router';
import { z } from 'zod';

import { githubLanguageUsage } from './authenticated/github-language-usage';
import { solvedAcTier } from './authenticated/solved-ac-tier';

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

  return prefixedRouter;
};