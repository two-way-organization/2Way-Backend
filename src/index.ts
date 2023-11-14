import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import camelCase from 'koa-camelcase-keys';

import jwt from 'koa-jwt';

import { unauthenticatedApplicantRoutes } from './routes/applicants';

function main() {
  const app = new koa();

  app.use(bodyParser());
  app.use(camelCase());

  app.use(unauthenticatedApplicantRoutes().routes());
  app.use(unauthenticatedApplicantRoutes().allowedMethods());

  app.use(jwt({
    secret: process.env.JWT_SECRET!,
  }));

  const port = process.env.PORT!;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main();