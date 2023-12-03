import { authRouter } from "./router/auth";
import { canvasRouter } from "./router/canvas";
import { careTeamRouter } from "./router/care-team";
import { postRouter } from "./router/post";
import { practitionerRouter } from "./router/practitioner";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  canvas: canvasRouter,
  careTeam: careTeamRouter,
  practitioner: practitionerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
