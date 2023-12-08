import { JobStatus } from '@prisma/client';

import { prismaClient } from '../../../../utils/prisma-client';

import { JwtPayloadState } from '../../../@types/jwt-payload-state';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';
import type { JobType, JobSalary, JobLocation, EducationLevel, ExperienceLevel } from '@prisma/client';
import type { JobTopicDetail } from './types';

interface JobCreateRequestBody {
  title: string;
  position: string;
  startDate: string;
  endDate: string;
  numberOfVacancies: number;
  experienceLevel: ExperienceLevel;
  educationLevel: EducationLevel;
  jobType: JobType;
  skill: string;
  salary: JobSalary;
  location: JobLocation;
  recruitmentImage: string;
  jobIntroduction: string;
  responsibilities: JobTopicDetail[];
  preferentialTreatment: JobTopicDetail[];
  hiringProcess: JobTopicDetail[];
  qualificationRequirements: JobTopicDetail[];
  personalStatementQuestion: string[];
  requiredDocuments: string;
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
      startDate: new Date(startDate),
      endDate: new Date(endDate),
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
      jobTopicDetails: {
        createMany: {
          data: responsibilities.map((responsibility) => ({
            topic: 'responsibilities',
            detail: responsibility.detail,
            itemOrder: responsibility.itemOrder,
          })).concat(qualificationRequirements.map((it) => ({
            topic: 'qualificationRequirements',
            detail: it.detail,
            itemOrder: it.itemOrder,
          }))).concat(preferentialTreatment.map((preferential) => ({
            topic: 'preferentialTreatment',
            detail: preferential.detail,
            itemOrder: preferential.itemOrder,
          }))).concat(hiringProcess.map((hiring) => ({
            topic: 'hiringProcess',
            detail: hiring.detail,
            itemOrder: hiring.itemOrder,
          })))
        },
      },
      personalStatementQuestion: {
        data: personalStatementQuestion,
      },
      requiredDocuments,
    },
  });

  ctx.status = 200;
  ctx.body = {
    message: 'Job created successfully.',
    id: job.id,
  };
};