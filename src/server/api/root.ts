import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "./routers/users";
import { projectsRouter } from "./routers/projects";
import { issuesRouter } from "./routers/issues";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  issues: issuesRouter,
  users: usersRouter,
  projects: projectsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
