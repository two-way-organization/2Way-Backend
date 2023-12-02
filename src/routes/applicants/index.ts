import zodRouter from 'koa-zod-router';
import { z } from 'zod';

import { register } from './unauthenticated/applicants/register';
import { login } from './unauthenticated/applicants/login';

import { randomJobs } from './unauthenticated/jobs/random-jobs';
import { recentJobs } from './unauthenticated/jobs/recent-jobs';

import { deregister } from './authenticated/applicants/delete';
import { modification } from './authenticated/applicants/modification';

import { inquire } from './authenticated/resumes/inquire';
import { resumeInexperiencedPut } from './authenticated/resumes/inexperienced/put';
import { resumeExperiencedPut } from './authenticated/resumes/experienced/put';

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
  
  prefixedRouter.get('/jobs/random', randomJobs);
  prefixedRouter.get('/jobs/recent', recentJobs);

  return prefixedRouter;
};

export const authenticatedApplicantRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/applicants',
    },
  });

  prefixedRouter.patch('/deactivate', deregister);
  prefixedRouter.patch('/', modification, {
    body: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().optional(),
    }),
  });

  prefixedRouter.get('/applicants/resumes', inquire);
  prefixedRouter.put('/applicants/inexperienced', resumeInexperiencedPut, {
    body: z.object({
      profile: z.object({
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
  prefixedRouter.put('/applicants/experienced', resumeExperiencedPut, {
    body: z.object({
      profile: z.object({
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

  return prefixedRouter;
};