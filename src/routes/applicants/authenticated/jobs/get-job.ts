import { prismaClient } from '../../../../utils/prisma-client';

import type { ParameterizedContext } from 'koa';
import type { ZodContext } from 'koa-zod-router';

import type { JwtPayloadState } from '../../../@types/jwt-payload-state';
import type { JobTopicDetail } from '../../../companies/authenticated/jobs/types';
import type { ErrorResponse } from '../../../@types/error-response';

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
    responsibilities: JobTopicDetail[];
    qualificationRequirements: JobTopicDetail[];
    preferentialTreatment: JobTopicDetail[];
    hiringProcess: JobTopicDetail[];
    personalStatementQuestion: string[];
    requiredDocuments: string;
    viewCount: number;
    skills: string[];
    jobFavoritedAt: (Date | null)[];
    companyFavoritedAt: (Date | null)[];
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
  const { id: applicantId } = ctx.state.user;
  const { jobId } = ctx.request.params;

  const job = await prismaClient.job.findUnique({
    where: {
      id: jobId,
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
      jobTopicDetails: true,
      personalStatementQuestion: true,
      requiredDocuments: true,
      viewCount: true,
      jobSkill: {
        where: {
          jobId,
        },
        select: {
          skillId: true,
        },
      },
      // get one activity
      applicantActivity: {
        where: {
          applicantId,
          jobId,
        },
        orderBy: {
          viewedAt: 'desc',
        },
        take: 1,
        select: {
          jobFavoritedAt: true,
          companyFavoritedAt: true,
        },
      },
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
        responsibilities: job.jobTopicDetails.filter((it) => it.topic === 'responsibilities'),
        qualificationRequirements: job.jobTopicDetails.filter((it) => it.topic === 'qualificationRequirements'),
        preferentialTreatment: job.jobTopicDetails.filter((it) => it.topic === 'preferentialTreatment'),
        hiringProcess: job.jobTopicDetails.filter((it) => it.topic === 'hiringProcess'),
        personalStatementQuestion: (job.personalStatementQuestion as { data: string[] }).data,
        requiredDocuments: job.requiredDocuments,
        viewCount: job.viewCount,
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
        companyFavoritedAt: job.applicantActivity.map((activity) => activity.companyFavoritedAt),
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

    await prismaClient.job.update({
      where: {
        id: jobId,
      },
      data: {
        viewCount: job.viewCount + 1,
      },
    });
  }
};