import { JobStatus } from '@prisma/client';

import { prismaClient } from '../../../../utils/prisma-client';

import { JwtPayloadState } from '../../../@types/jwt-payload-state';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { JobType, JobSalary, JobLocation, EducationLevel, ExperienceLevel } from '@prisma/client';

interface JobCreateRequestBody {
  title: string;
  position: string;
  startDate: Date;
  endDate: Date;
  numberOfVacancies: number;
  experienceLevel: ExperienceLevel;
  educationLevel: EducationLevel;
  jobType: JobType;
  skill: string;
  salary: JobSalary;
  location: JobLocation;
  recruitmentImage: string;
  jobIntroduction: string;
  responsibilities: string;
  preferentialTreatment: string;
  hiringProcess: string;
  personalStatementQuestion: string;
  requiredDocuments: string;
  qualificationRequirements: string;
}

interface JobCreateResponseBody {
  message: string;
  id: number;
}

export const createJob = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, unknown, unknown, JobCreateRequestBody, unknown>, JobCreateResponseBody>,
) => {
  const {
    title,
    position,
    startDate,
    endDate,
    numberOfVacancies,
    experienceLevel,
    educationLevel,
    jobType,
    skill,
    salary,
    location,
    recruitmentImage,
    jobIntroduction,
    responsibilities,
    preferentialTreatment,
    hiringProcess,
    personalStatementQuestion,
    requiredDocuments,
    qualificationRequirements,
  } = ctx.request.body;

  const { id: companyId } = ctx.state.user;

  const positionModel = await prismaClient.position.create({
    data: {
      positionName: position,
    },
  });

  const skillModel = await prismaClient.skill.create({
    data: {
      skillName: skill,
    },
  });

  const job = await prismaClient.job.create({
    data: {
      companyId,
      status: JobStatus.Ongoing,
      title,
      jobPosition: {
        create: {
          positionId: positionModel.id,
        },
      },
      startDate,
      endDate,
      numberOfVacancies,
      experienceLevel,
      educationLevel,
      jobType,
      jobSkill: {
        create: {
          skillId: skillModel.id,
        },
      },
      salary,
      location,
      recruitmentImage,
      jobIntroduction,
      responsibilities,
      preferentialTreatment,
      hiringProcess,
      personalStatementQuestion,
      requiredDocuments,
      qualificationRequirements,
    },
  });

  ctx.status = 200;
  ctx.body = {
    message: 'Job created successfully.',
    id: job.id,
  };
};