import { authRouter } from "./router/auth";
import { careTeamRouter } from "./router/care-team";
import { communicationRouter } from "./router/communication";
import { consentRouter } from "./router/consent";
import { coverageRouter } from "./router/coverage";
import { patientRouter } from "./router/patient";
import { patientMedicalHistoryRouter } from "./router/patient-medical-history";
import { postRouter } from "./router/post";
import { practitionerRouter } from "./router/practitioner";
import { questionnaireRouter } from "./router/questionnaire";
import { schedulingRouter } from "./router/scheduling";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  careTeam: careTeamRouter,
  practitioner: practitionerRouter,
  communication: communicationRouter,
  patient: patientRouter,
  questionnaire: questionnaireRouter,
  consent: consentRouter,
  coverage: coverageRouter,
  patientMedicalHistory: patientMedicalHistoryRouter,
  scheduling: schedulingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
