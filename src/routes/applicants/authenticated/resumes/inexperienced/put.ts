import { prismaClient } from '../../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../../@types/jwt-payload-state';
import type { EducationLevel, ExperienceLevel } from '@prisma/client';

export interface ResumePutRequestBody {
  profile: {
    gitHubId: string;
    educationLevel: EducationLevel;
    schoolName: string,
    major: string,
    gender: string,
    birth: Date,
    address: string,
    experienceLevel: ExperienceLevel,
  };
}

export interface ResumePutResponseBody {
  applicantId?: number;
  message: string;
}

export const resumeInexperiencedPut = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, ResumePutRequestBody, unknown>, ResumePutResponseBody>,
) => {
  const { id, email } = ctx.state.user;
  const { profile } = ctx.request.body;

  const account = await prismaClient.applicant.findUnique({
    where: {
      id,
      email,
    },
  });

  if (!account) {
    ctx.status = 404;
    ctx.body = {
      message: 'Account not found.',
    };
  } else {
    await prismaClient.applicantResume.create({
      data: {
        applicantId: account.id,
        gitHubId: profile.gitHubId,
        educationLevel: profile.educationLevel,
        schoolName: profile.schoolName,
        major: profile.major,
        gender: profile.gender,
        birth: profile.birth,
        address: profile.address,
        experienceLevel: profile.experienceLevel,
      },
    });

    ctx.status = 201;
    ctx.body = {
      applicantId: account.id,
      message: 'Registration successful.',
    };
  }
};