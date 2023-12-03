import zodRouter from 'koa-zod-router';
import { z } from 'zod';

import { ParameterizedContext } from 'koa';

import { deregister } from './authenticated/deregister';
import { modification } from './authenticated/modification';
import { introduction } from './authenticated/home/introduction';

import { register } from './unauthenticated/companies/register';
import { login } from './unauthenticated/companies/login';
import { createInfo } from './authenticated/info/create-info';
import { getInfo } from './authenticated/info/get-info';
import { ongoing } from './authenticated/jobs/ongoing';
import { closed } from './authenticated/jobs/closed';

import { createSolution } from './authenticated/info/solution/create-solution';
import { getSolution } from './authenticated/info/solution/get-solution';

import { createJob } from './authenticated/jobs/step';
import { extendJob } from './authenticated/jobs/extend';
import { deleteJob } from './authenticated/jobs/delete';
import { statusJob } from './authenticated/jobs/status';
import { getJob } from './authenticated/jobs/get-job';

import { addFavoriteApplicant } from './authenticated/jobs/applicants/add-favorite';
import { removeFavoriteApplicant } from './authenticated/jobs/applicants/remove-favorite';

import { waitingCompanies } from './authenticated/jobs/applicants/status/waiting';
import { successCompanies } from './authenticated/jobs/applicants/status/success';
import { failedCompanies } from './authenticated/jobs/applicants/status/failed';

import type { JwtPayloadState } from '../@types/jwt-payload-state';

export const unauthenticatedCompanyRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/companies',
    },
  });

  prefixedRouter.put(
    '/',
    register,
    {
      body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      }),
    }
  );

  prefixedRouter.post(
    '/',
    login,
    {
      body: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    }
  );

  return prefixedRouter;
};

export const authenticatedCompanyRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/companies',
    },
  });

  prefixedRouter.use(async (ctx: ParameterizedContext<JwtPayloadState>, next) => {
    if (ctx.path.startsWith('/companies') && ctx.state.user.role !== 'company') {
      ctx.status = 403;
      ctx.body = {
        message: 'Forbidden.',
      };
    } else {
      await next();
    }
  });

  prefixedRouter.delete('/', deregister);
  prefixedRouter.patch('/', modification, {
    body: z.object({
      companyName: z.string().optional(),
      email: z.string().optional(),
      password: z.string().optional(),
    }),
  });
  prefixedRouter.get('/home/introduction', introduction);
  prefixedRouter.put('/info', createInfo, {
    body: z.object({
      profile: z.object({
        registrationNumber: z.string(),
        companyName: z.string(),
        ceoName: z.string(),
        introduction: z.string().optional(),
        industries: z.array(z.object({
          solutionId: z.number(),
        })),
        logoImage: z.string(),
        companyType: z.enum(['SmallBusiness', 'MediumEnterprise', 'Enterprise']),
        numberOfEmployees: z.number(),
        capital: z.number(),
        establishmentDate: z.date(),
        mainBusiness: z.array(z.string()),
      }),
    }),
  });
  prefixedRouter.get('/info', getInfo);
  prefixedRouter.get('/jobs/ongoing', ongoing, {
    query: z.object({
      page: z.number(),
      pageSize: z.number(),
    }),
  });
  prefixedRouter.get('/jobs/closed', closed, {
    query: z.object({
      page: z.number(),
      pageSize: z.number(),
    }),
  });
  prefixedRouter.put('/jobs/extend', extendJob, {
    body: z.object({
      jobId: z.number(),
      endDate: z.date(),
    }),
  });
  prefixedRouter.delete('/jobs', deleteJob, {
    body: z.object({
      jobId: z.number(),
    }),
  });
  prefixedRouter.patch('/jobs/status', statusJob, {
    body: z.object({
      jobId: z.number(),
      status: z.enum(['Ongoing', 'Closed']),
    }),
  });
  prefixedRouter.get('/jobs/:jobId', getJob, {
    params: z.object({
      jobId: z.number(),
    }),
  });
  prefixedRouter.put('/jobs/solution', createSolution, {
    body: z.object({
      solutions: z.array(z.string()),
    }),
  });
  prefixedRouter.get('/jobs/solution', getSolution);
  prefixedRouter.put('/jobs/step', createJob, {
    body: z.object({
      title: z.string(),
      position: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      numberOfVacancies: z.number(),
      educationLevel: z.enum(['MastersOrDoctorate', 'AssociateDegree', 'BachelorsDegree', 'MastersOrDoctorate', 'EducationNotRequired']),
      experienceLevel: z.enum(['Newcomer', 'Experienced', 'Unspecified']),
      jobType: z.enum(['Regular', 'Contract', 'Intern']),
      skill: z.string(),
      contractPeriod: z.string(),
      salary: z.enum(['DecisionAfterTheInterview', 'AccordingToCompanyPolicy']),
      location: z.enum(['Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju', 'Daejeon', 'Ulsan', 'Sejong', 'Gyeonggi', 'Gangwon', 'Chungbuk', 'Chungnam', 'Jeonbuk', 'Jeonnam', 'Gyeongbuk', 'Gyeongnam', 'Jeju']),
      recruitmentImage: z.string(),
      jobIntroduction: z.string(),
      responsibilities: z.array(z.object({
        detail: z.string(),
        itemOrder: z.number(),
      })),
      preferentialTreatment: z.array(z.object({
        itemOrder: z.number(),
        detail: z.string(),
      })),
      qualificationRequirements: z.array(z.object({
        itemOrder: z.number(),
        detail: z.string(),
      })),
      hiringProcess: z.array(z.object({
        itemOrder: z.number(),
        detail: z.string(),
      })),
      personalStatementQuestion: z.array(z.string()),
      requiredDocuments: z.string(),
    }),
  });
  prefixedRouter.post('/jobs/applicants/favorite', addFavoriteApplicant, {
    body: z.object({
      jobId: z.number(),
      applicantId: z.number(),
    }),
  });
  prefixedRouter.delete('/jobs/applicants/favorite', removeFavoriteApplicant, {
    body: z.object({
      jobId: z.number(),
      applicantId: z.number(),
    }),
  });
  prefixedRouter.get('/jobs/:jobId/applicants/status/waiting', waitingCompanies);
  prefixedRouter.get('/jobs/:jobId/applicants/status/success', successCompanies);
  prefixedRouter.get('/jobs/:jobId/applicants/status/failed', failedCompanies);

  return prefixedRouter;
};