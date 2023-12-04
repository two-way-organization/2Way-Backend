import zodRouter from 'koa-zod-router';
import { z } from 'zod';

import { register } from './unauthenticated/applicants/register';
import { login } from './unauthenticated/applicants/login';

import { randomJobs } from './authenticated/applicants/jobs/random-jobs';
import { recentJobs } from './authenticated/applicants/jobs/recent-jobs';
import { searchJob } from './authenticated/applicants/jobs/search';

import { deregister } from './authenticated/applicants/delete';
import { modification } from './authenticated/applicants/modification';

import { inquire } from './authenticated/resumes/inquire';
import { resumeInexperiencedPut } from './authenticated/resumes/inexperienced/put';
import { resumeExperiencedPut } from './authenticated/resumes/experienced/put';

import { applyJob } from './authenticated/applications/apply-job';
import { createCoverLetters } from './authenticated/applications/create-cover-letters';
import { analyzeCoverLetters } from './authenticated/applications/analyze-cover-letters';
import { getCoverLetters } from './authenticated/applications/get-cover-letters';

import { waitingApplications } from './authenticated/applications/status/waiting';
import { preferredApplications } from './authenticated/applications/status/preferred';
import { successApplications } from './authenticated/applications/status/success';
import { failedApplications } from './authenticated/applications/status/failed';
import { deleteApplication } from './authenticated/applications/delete';

import { applicantSetJobFavorite } from './authenticated/jobs/set-favorites';
import { applicantRemoveJobFavorite } from './authenticated/jobs/unset-favorites';
import { applicantSetCompanyFavorite } from './authenticated/companies/set-favorites';
import { applicantRemoveCompanyFavorite } from './authenticated/companies/unset-favorites';

import { applicationsSavedJobs } from './authenticated/saved-jobs';
import { applicantsRecentlyViewed } from './authenticated/recently-viewed';
import { applicationsSavedCompany } from './authenticated/saved-company';

import { applicationsDetails } from '../companies/authenticated/applications/detail';

import type { JwtPayloadState } from '../@types/jwt-payload-state';
import type { ParameterizedContext } from 'koa';

export const unauthenticatedApplicantRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/applicants',
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

export const authenticatedApplicantRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/applicants',
    },
  });

  prefixedRouter.use(async (ctx: ParameterizedContext<JwtPayloadState>, next) => {
    if (ctx.path.startsWith('/applicants') && ctx.state.user.role !== 'applicant') {
      ctx.status = 403;
      ctx.body = {
        message: 'Forbidden.',
      };
    } else {
      await next();
    }
  });

  prefixedRouter.patch('/deactivate', deregister);
  prefixedRouter.patch('/', modification, {
    body: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().optional(),
    }),
  });

  prefixedRouter.get('/resumes', inquire);
  prefixedRouter.put('/resumes/inexperienced', resumeInexperiencedPut, {
    body: z.object({
      profile: z.object({
        baekjoonId: z.string(),
        gitHubId: z.string(),
        educationLevel: z.enum(['MastersOrDoctorate', 'AssociateDegree', 'BachelorsDegree', 'MastersOrDoctorate', 'EducationNotRequired']),
        schoolName: z.string(),
        major: z.string(),
        gender: z.string(),
        birth: z.date(),
        address: z.string(),
        experienceLevel: z.enum(['Newcomer', 'Experienced', 'Unspecified']),
      }),
    }),
  });
  prefixedRouter.put('/resumes/experienced', resumeExperiencedPut, {
    body: z.object({
      profile: z.object({
        baekjoonId: z.string(),
        gitHubId: z.string(),
        educationLevel: z.enum(['MastersOrDoctorate', 'AssociateDegree', 'BachelorsDegree', 'MastersOrDoctorate', 'EducationNotRequired']),
        schoolName: z.string(),
        major: z.string(),
        gender: z.string(),
        birth: z.date(),
        address: z.string(),
        experienceLevel: z.enum(['Newcomer', 'Experienced', 'Unspecified']),
        totalExperience: z.number(),
        companyName: z.string(),
        duties: z.string(),
      }),
    }),
  });
  prefixedRouter.post('/applications/apply-job', applyJob, {
    body: z.object({
      jobId: z.number(),
    }),
  });
  prefixedRouter.put('/applications/:applicationId/cover-letters', createCoverLetters, {
    params: z.object({
      applicationId: z.number(),
    }),
    body: z.object({
      questions: z.array(z.object({
        applicantResponse: z.string(),
      })),
    }),
  });
  prefixedRouter.post('/applications/:applicationId/cover-letters/analyze', analyzeCoverLetters, {
    params: z.object({
      applicationId: z.number(),
    }),
  });
  prefixedRouter.get('/applications/:applicationId/cover-letters', getCoverLetters);
  prefixedRouter.get('/applications/status/waiting', waitingApplications);
  prefixedRouter.get('/applications/status/preferred', preferredApplications);
  prefixedRouter.get('/applications/status/success', successApplications);
  prefixedRouter.get('/applications/status/failed', failedApplications);
  prefixedRouter.delete('/applications/:applicationId', deleteApplication, {
    params: z.object({
      applicationId: z.number(),
    }),
  });

  prefixedRouter.get('/applications/:applicationId/details', applicationsDetails);

  prefixedRouter.put('/jobs/favorites', applicantSetJobFavorite, {
    body: z.object({
      jobId: z.number(),
      applicantId: z.number(),
    }),
  });
  prefixedRouter.put('/jobs/favorites', applicantRemoveJobFavorite, {
    body: z.object({
      jobId: z.number(),
      applicantId: z.number(),
    }),
  });

  prefixedRouter.put('/companies/favorites', applicantSetCompanyFavorite, {
    body: z.object({
      companyId: z.number(),
      applicantId: z.number(),
    }),
  });
  prefixedRouter.put('/companies/favorites', applicantRemoveCompanyFavorite, {
    body: z.object({
      companyId: z.number(),
      applicantId: z.number(),
    }),
  });

  prefixedRouter.get('/saved-jobs', applicationsSavedJobs);
  prefixedRouter.get('/recently-viewed', applicantsRecentlyViewed);
  prefixedRouter.get('/saved-company', applicationsSavedCompany);

  prefixedRouter.get('/jobs/random', randomJobs);
  prefixedRouter.get('/jobs/recent', recentJobs);
  prefixedRouter.get('/jobs/search', searchJob, {
    query: z.object({
      location: z.enum(['Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju', 'Daejeon', 'Ulsan', 'Sejong', 'Gyeonggi', 'Gangwon', 'Chungbuk', 'Chungnam', 'Jeonbuk', 'Jeonnam', 'Gyeongbuk', 'Gyeongnam', 'Jeju']),
      title: z.string(),
      jobType: z.enum(['Regular', 'Contract', 'Intern']),
      experienceLevel: z.enum(['Newcomer', 'Experienced', 'Unspecified']),
      skills: z.array(z.string()),
    }),
  });

  return prefixedRouter;
};