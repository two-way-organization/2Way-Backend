import { prismaClient } from '../../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../../@types/jwt-payload-state';
import type { EducationLevel, ExperienceLevel } from '@prisma/client';

export interface ExperiencedPutRequestBody {
  profile: {
    gitHubId: string;
    educationLevel: EducationLevel;
    schoolName: string,
    major: string,
    gender: string,
    birth: Date,
    address: string,
    experienceLevel: ExperienceLevel,
    totalExperience: number,
    companyName: string,
    duties: string,
  };
}

export interface ExperiencedPutResponseBody {
  applicantId?: number;
  message: string;
}

export const resumeExperiencedPut = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, ExperiencedPutRequestBody, unknown>, ExperiencedPutResponseBody>,
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
        totalExperience: profile.totalExperience,
        companyName: profile.companyName,
        duties: profile.duties,
      },
    });

    ctx.status = 201;
    ctx.body = {
      applicantId: account.id,
      message: 'Registration successful.',
    };
  }
};