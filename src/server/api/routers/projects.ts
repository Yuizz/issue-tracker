import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string(),
      isPublic: z.boolean(),
    }))
    .mutation(({ ctx, input }) => {
      const user = ctx.session.user;

      return ctx.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          isPublic: input.isPublic,
          users: {
            create: {
              userId: user.id,
              isOwner: true,
              isEditor: true
            }
          }
        }
      });
    }),
});
