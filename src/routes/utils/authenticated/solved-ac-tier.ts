import { UserApi } from '@solvedac-community/api';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { JwtPayloadState } from '../../@types/jwt-payload-state';

export interface SolvedAcTierRequestBody {
  solvedAcUsername: string;
}

export interface SolvedAcTierResponseBody {
  /**
   * Bronze V를 1, Bronze IV를 2, ..., Ruby I을 30, Master를 31로 표현하는 사용자 티어입니다.
   *
   * <details>
   *   <summary>
   *     표1. 수치 - 이름 표
   *   </summary>
   *
   *   | 수치 | 이름         |
   *   | ---: | ------------ |
   *   |    1 | Bronze V     |
   *   |    2 | Bronze IV    |
   *   |    3 | Bronze III   |
   *   |    4 | Bronze II    |
   *   |    5 | Bronze I     |
   *   |    6 | Silver V     |
   *   |    7 | Silver IV    |
   *   |    8 | Silver III   |
   *   |    9 | Silver II    |
   *   |   10 | Silver I     |
   *   |   11 | Gold V       |
   *   |   12 | Gold IV      |
   *   |   13 | Gold III     |
   *   |   14 | Gold II      |
   *   |   15 | Gold I       |
   *   |   16 | Platinum V   |
   *   |   17 | Platinum IV  |
   *   |   18 | Platinum III |
   *   |   19 | Platinum II  |
   *   |   20 | Platinum I   |
   *   |   21 | Diamond V    |
   *   |   22 | Diamond IV   |
   *   |   23 | Diamond III  |
   *   |   24 | Diamond II   |
   *   |   25 | Diamond I    |
   *   |   26 | Ruby V       |
   *   |   27 | Ruby IV      |
   *   |   28 | Ruby III     |
   *   |   29 | Ruby II      |
   *   |   30 | Ruby I       |
   *   |   31 | Master       |
   *
   * </details>
   * @type {number}
   */
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