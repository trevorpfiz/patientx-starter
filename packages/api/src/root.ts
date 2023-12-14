import { allergyIntoleranceRouter } from "./router/allergy-intolerance";
import { authRouter } from "./router/auth";
import { careTeamRouter } from "./router/care-team";
import { communicationRouter } from "./router/communication";
import { consentRouter } from "./router/consent";
import { coverageRouter } from "./router/coverage";
import { diagnosticReportRouter } from "./router/diagnostic-report";
import { documentRouter } from "./router/document";
import { medicationRouter } from "./router/medication";
import { observationRouter } from "./router/observation";
import { patientRouter } from "./router/patient";
import { patientMedicalHistoryRouter } from "./router/patient-medical-history";
import { paymentRouter } from "./router/payment";
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
  document: documentRouter,
  patient: patientRouter,
  questionnaire: questionnaireRouter,
  consent: consentRouter,
  coverage: coverageRouter,
  patientMedicalHistory: patientMedicalHistoryRouter,
  scheduling: schedulingRouter,
  payment: paymentRouter,
  diagnosticReport: diagnosticReportRouter,
  observation: observationRouter,
  allergyIntolerance: allergyIntoleranceRouter,
  medication: medicationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
