import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';

export interface ErrorResponse {
  message: string;
}

export interface GetRequestParams {
  jobId: number;
}

export interface GetResponseBody {
  jobs: {
    jobId: number;
    companyName: string;
    title: string;
    position: string[];
    startDate: Date;
    endDate: Date;
    numberOfVacancies: number;
    experienceLevel: string;
    educationLevel: string;
    jobType: string;
    salary: string;
    location: string;
    recruitmentImage: string;
    jobIntroduction: string | null;
    responsibilities: string | null;
    qualificationRequirements: string | null;
    preferentialTreatment: string | null;
    hiringProcess: string | null;
    personalStatementQuestion: string;
    requiredDocuments: string;
    skills: string[];
    jobFavoritedAt: (Date | null)[];
  },
  profile: {
    companyName: string;
    registrationNumber: string;
    ceoName: string;
    introduction: string | null;
    logoImage: string;
    companyType: string;
    numberOfEmployees: number;
    capital: number;
    establishmentDate: Date;
    mainBusiness: string[];
  },
}

export const getJob = async (
  ctx: ParameterizedContext<JwtPayloadState, ZodContext<unknown, GetRequestParams, unknown, unknown, unknown>, ErrorResponse | GetResponseBody>,
) => {
  const { id: companyId } = ctx.state.user;
  const { jobId } = ctx.request.params;

  const job = await prismaClient.job.findUnique({
    where: {
      id: jobId,
      companyId,
    },
    select: {
      id: true,
      companyId: true,
      title: true,
      jobPosition: true,
      startDate: true,
      endDate: true,
      numberOfVacancies: true,
      experienceLevel: true,
      educationLevel: true,
      jobType: true,
      salary: true,
      location: true,
      recruitmentImage: true,
      jobIntroduction: true,
      responsibilities: true,
      qualificationRequirements: true,
      preferentialTreatment: true,
      hiringProcess: true,
      personalStatementQuestion: true,
      requiredDocuments: true,
      jobSkill: true,
      applicantActivity: true,
    }
  });

  if (!job) {
    ctx.status = 404;
    ctx.body = {
      message: 'Job not found.',
    };
  } else {
    ctx.status = 200;

    const companyInfo = (await prismaClient.companyInfo.findUnique({
      where: {
        companyId: job.companyId,
      },
    }))!;

    ctx.body = {
      jobs: {
        jobId: job.id,
        companyName: companyInfo.companyName,
        title: job.title,
        position: await Promise.all(job.jobPosition.map(async (position) => {
          return (await prismaClient.position.findUnique({
            where: {
              id: position.positionId,
            },
            select: {
              positionName: true,
            },
          }))!.positionName;
        })),
        startDate: job.startDate,
        endDate: job.endDate,
        numberOfVacancies: job.numberOfVacancies,
        experienceLevel: job.experienceLevel,
        educationLevel: job.educationLevel,
        jobType: job.jobType,
        salary: job.salary,
        location: job.location,
        recruitmentImage: job.recruitmentImage,
        jobIntroduction: job.jobIntroduction,
        responsibilities: job.responsibilities,
        qualificationRequirements: job.qualificationRequirements,
        preferentialTreatment: job.preferentialTreatment,
        hiringProcess: job.hiringProcess,
        personalStatementQuestion: job.personalStatementQuestion,
        requiredDocuments: job.requiredDocuments,
        skills: await Promise.all(job.jobSkill.map(async (skill) => {
          return (await prismaClient.skill.findUnique({
            where: {
              id: skill.skillId,
            },
            select: {
              skillName: true,
            },
          }))!.skillName;
        })),
        jobFavoritedAt: job.applicantActivity.map((activity) => activity.jobFavoritedAt),
      },
      profile: {
        companyName: companyInfo.companyName,
        registrationNumber: companyInfo.registrationNumber,
        ceoName: companyInfo.ceoName,
        introduction: companyInfo.introduction,
        logoImage: companyInfo.logoImage,
        companyType: companyInfo.companyType,
        numberOfEmployees: companyInfo.numberOfEmployees,
        capital: companyInfo.capital.toNumber(),
        establishmentDate: companyInfo.establishmentDate,
        mainBusiness: (companyInfo.mainBusiness as { data: string[] }).data,
      },
    };
  }
};