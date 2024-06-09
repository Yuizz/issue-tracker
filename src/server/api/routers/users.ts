import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
    });
  }),

  getMe: protectedProcedure.query(({ ctx }) => {
    const user = ctx.session.user
    return ctx.prisma.project.findMany({
      where: {
        users: {
          some: {
            userId: user.id
          }
        }
      }
    })
  })
});