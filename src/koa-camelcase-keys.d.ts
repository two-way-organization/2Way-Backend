declare module 'koa-camelcase-keys' {
  import type { DefaultState, DefaultContext, Middleware } from 'koa';

  const camelCaseKeys: () => Middleware<DefaultState, DefaultContext, unknown>;
  
  export default camelCaseKeys;
}