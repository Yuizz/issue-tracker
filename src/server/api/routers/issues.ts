import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const issuesRouter = createTRPCRouter({
  getByProjectId: publicProcedure.input(
    z.object({
      projectId: z.string()
    })
  ).query(async ({ ctx, input }) => {
    const { projectId } = input
    const project = await ctx.prisma.project.findUnique({
      where: {
        id: projectId
      },
      include: {
        users: true
      }
    })

    if (!project || (!project.isPublic && (!ctx || !ctx.session))) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found"
      })
    }

    const user = ctx.session.user;
    if (!project.isPublic && !project.users.some(u => u.userId === user.id)) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found"
      })
    }

    const issues = await ctx.prisma.issue.groupBy({
      by: ["status"],
      where: {
        projectId
      },
    })

    return issues
  })
});