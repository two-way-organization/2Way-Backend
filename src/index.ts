import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import camelCase from 'koa-camelcase-keys';

import jwt from 'koa-jwt';

import cors from '@koa/cors';

import { authenticatedApplicantRoutes, unauthenticatedApplicantRoutes } from './routes/applicants';
import { authenticatedCompanyRoutes, unauthenticatedCompanyRoutes } from './routes/companies';
import { authenticatedUtilsRoutes } from './routes/utils';

function main() {
  const app = new koa();

  app.use(bodyParser());
  app.use(camelCase());
  app.use(cors());

  const unauthenticatedApplicant = unauthenticatedApplicantRoutes();
  const unauthenticatedCompany = unauthenticatedCompanyRoutes();
  app.use(unauthenticatedApplicant.routes());
  app.use(unauthenticatedApplicant.allowedMethods());
  app.use(unauthenticatedCompany.routes());
  app.use(unauthenticatedCompany.allowedMethods());

  app.use(jwt({
    secret: process.env.JWT_SECRET!,
    algorithms: [process.env.JWT_ALGORITHM!],
    issuer: process.env.JWT_ISSUER!,
  }));
  
  const authenticatedApplicant = authenticatedApplicantRoutes();
  const authenticatedCompany = authenticatedCompanyRoutes();
  const authenticatedUtils = authenticatedUtilsRoutes();
  app.use(authenticatedApplicant.routes());
  app.use(authenticatedApplicant.allowedMethods());
  app.use(authenticatedCompany.routes());
  app.use(authenticatedCompany.allowedMethods());
  app.use(authenticatedUtils.routes());
  app.use(authenticatedUtils.allowedMethods());

  const port = process.env.PORT!;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main();