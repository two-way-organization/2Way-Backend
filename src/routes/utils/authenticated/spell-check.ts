import { spellCheck } from '../../../utils/spell-check';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { JwtPayloadState } from '../../@types/jwt-payload-state';
import type { HanspellResult } from 'hanspell';

export interface SpellCheckRequestBody {
  text: string;
}

export interface SpellCheckResponseBody {
  /**
   * 맞춤법 검사 결과입니다.
   */
  result: HanspellResult[];
}

export const postSpellCheck = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, SpellCheckRequestBody, unknown>, SpellCheckResponseBody>,
) => {
  const { text } = ctx.request.body;

  const result = await spellCheck(text);

  ctx.status = 200;
  ctx.body = {
    result,
  };
};