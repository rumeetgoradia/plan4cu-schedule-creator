import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { gatewayRouter } from "~/server/api/routers/gateway";
import {scheduleRouter} from "~/server/api/routers/schedule";
import { dbRouter } from "~/server/api/routers/db";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  gateway: gatewayRouter,
  schedule: scheduleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
