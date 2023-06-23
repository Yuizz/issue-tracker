import { randomUUID } from "crypto";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

type Project = { id: string; name: string; userId: string };
const projects: Project[] = [];

export const projectsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany({});
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      const user = ctx.session.user;
      const project = { id: randomUUID(), ...input, userId: user.id };

      return ctx.prisma.project.create({ data: project });
    }),
});
