import zodRouter from 'koa-zod-router';

export const unauthenticatedJobRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/jobs',
    },
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