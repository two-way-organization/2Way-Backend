import zodRouter from 'koa-zod-router';
import { z } from 'zod';

import { step1 } from './authenticated/create/step1';
import { step2 } from './authenticated/create/step2';
import { step3 } from './authenticated/create/step3';
import { step4 } from './authenticated/create/step4';
import { step5 } from './authenticated/create/step5';
import { completePost } from './authenticated/complete/job-id-post';
import { jobInquire } from './authenticated/inquire';
import { jobAllInquire } from './authenticated/all-inquire';
import { jobModification } from './authenticated/modification';
import { jobDelete } from './authenticated/delete';

export const unauthenticatedJobRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/jobs',
    },
  });

  return prefixedRouter;
};

export const authenticatedJobRoutes = () => {
  const prefixedRouter = zodRouter({
    koaRouter: {
      prefix: '/jobs',
    },
  });

  prefixedRouter.put('/create/step1', step1, {
    body: z.object({
      title: z.string(),
      position: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      numberOfVacancies: z.number(),
    }),
  });
  prefixedRouter.put('/create/step2', step2, {
    body: z.object({
      id: z.number(),
      experienceLevel: z.enum(['Newcomer', 'Experienced', 'Unspecified']),
      experienceYears: z.string(),
      jobType: z.enum(['Regular', 'Contract', 'Intern']),
      contractPeriod: z.string(),
      salary: z.string(),
      location: z.string(),
      detail: z.object({
        responsibilities: z.string(),
        qualificationRequirements: z.string(),
      }),
    }),
  });
  prefixedRouter.put('/create/step3', step3, {
    body: z.object({
      id: z.number(),
      companyIntroduction: z.string(),
      detail: z.object({
        welfareBenefits: z.string(),
        notice: z.string(),
        note: z.string(),
      }),
    }),
  });
  prefixedRouter.put('/create/step4', step4, {
    body: z.object({
      id: z.number(),
      detail: z.object({
        hiringProcess: z.string(),
      }),
    }),
  });
  prefixedRouter.put('/create/step5', step5, {
    body: z.object({
      id: z.number(),
      detail: z.object({
        personalStatementQuestions: z.string(),
        requiredDocuments: z.string(),
      }),
    }),
  });
  prefixedRouter.post('/complete/:id', completePost, {
    params: z.object({
      id: z.number(),
    }),
  });
  prefixedRouter.get('/:id', jobInquire, {
    params: z.object({
      id: z.number(),
    }),
  });
  prefixedRouter.get('/', jobAllInquire);
  prefixedRouter.put('/:id', jobModification, {
    params: z.object({
      id: z.number(),
    }),
    body: z.object({
      title: z.string(),
      position: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      numberOfVacancies: z.number(),
      experienceLevel: z.enum(['Newcomer', 'Experienced', 'Unspecified']),
      experienceYears: z.string(),
      jobType: z.enum(['Regular', 'Contract', 'Intern']),
      contractPeriod: z.string(),
      salary: z.string(),
      location: z.string(),
    }),
  });
  prefixedRouter.delete('/:id', jobDelete, {
    params: z.object({
      id: z.number(),
    }),
  });

  return prefixedRouter;
};