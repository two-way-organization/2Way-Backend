import { UserApi } from '@solvedac-community/api';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { JwtPayloadState } from '../@types/jwt-payload-state';

export interface SolvedAcTierRequestBody {
  solvedAcUsername: string;
}

export interface SolvedAcTierResponseBody {
  tier: number;
}

export const solvedAcTier = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, SolvedAcTierRequestBody, unknown>, SolvedAcTierResponseBody>,
) => {
  const { solvedAcUsername } = ctx.request.body;

  const userApi = new UserApi();
  const userData = await userApi.getUser({
    handle: solvedAcUsername,
  });

  ctx.status = 200;
  ctx.body = {
    tier: userData.tier,
  };
};