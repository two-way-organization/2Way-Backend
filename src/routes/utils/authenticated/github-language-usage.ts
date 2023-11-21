import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { JwtPayloadState } from '../../@types/jwt-payload-state';
import type { GitHubRepo } from '../@types/github-repo-api';

const GITHUB_API_URL = 'https://api.github.com/users/{username}/repos';

export interface GitHubRequestBody {
  githubUsername: string;
}

export interface GitHubResponseBody {
  /**
   * 사용자의 GitHub 언어 사용량입니다.
   *
   * @type {Record<string, number>}
   */
  languageUsage: Record<string, number>;
}

/**
 * 사용자의 GitHub 언어 사용량을 퍼센트 단위로 반환합니다.
 *
 * @example
 * request body:
 * {
 *   "githubUsername": "<GitHub username>"
 * }
 *
 * successful response body:
 * {
 *   "languageUsage": {
 *     "JavaScript": 19,
 *     "TypeScript": 81,
 *   }
 * }
 *
 * @param ctx
 */
export const githubLanguageUsage = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, GitHubRequestBody, unknown>, GitHubResponseBody>,
) => {
  const { githubUsername } = ctx.request.body;

  const response = await fetch(GITHUB_API_URL.replace('{username}', githubUsername));
  const repositories = await response.json() as GitHubRepo[];

  const languageUsage: Record<string, number> = {};
  // analyze language usage with repository size, and store it with percentage
  repositories.forEach((repository) => {
    if (repository.language) {
      if (languageUsage[repository.language]) {
        languageUsage[repository.language] += repository.size;
      } else {
        languageUsage[repository.language] = repository.size;
      }
    }
  });

  const totalSize = Object.values(languageUsage).reduce((acc, cur) => acc + cur, 0);
  Object.keys(languageUsage).forEach((language) => {
    languageUsage[language] = languageUsage[language] / totalSize * 100;
  });

  ctx.status = 200;
  ctx.body = {
    languageUsage,
  };
};
