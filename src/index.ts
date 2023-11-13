import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaRouter from 'koa-router';
// import zodRouter from 'koa-zod-router';

function main() {
  const app = new koa();
  const router = new koaRouter();

  app.use(bodyParser());
  app.use(router.routes());

  const port = process.env.PORT ?? 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main();