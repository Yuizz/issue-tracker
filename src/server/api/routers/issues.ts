import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  CreateIssueSchema,
  UpdateIssueSchema
} from "~/schemas"

const projectSchema = z.object({
  slug: z.string().optional(),
  name: z.string().optional(),
  id: z.string().optional(),
})


export type IssueResponse = Prisma.IssueGetPayload<{
  select: {
    id: true,
    name: true,
    status: true,
    dueDate: true
  }
  include: {
    assignes: true
  }
}>

export const issuesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateIssueSchema)
    .mutation(async ({ ctx, input }) => {
      const newIssue = await ctx.prisma.issue.create({
        data: {
          name: input.name,
          description: input.description,
          dueDate: input.dueDate,
          status: input.status,
          project: {
            connect: {
              id: input.projectId
            }
          },
        }
      })

      if (input.assignes) {
        await Promise.all(input.assignes.map(async (userId) => {
          await ctx.prisma.issueToUser.create({
            data: {
              issueId: newIssue.id,
              userId,
            }
          })
        })
        )
      }

      return newIssue
    })
  ,

  update: protectedProcedure.input(
    UpdateIssueSchema
  ).mutation(async ({ ctx, input }) => {
    const { id, assignes, ...updateData } = input
    const issue = await ctx.prisma.issue.update({
      where: {
        id
      },
      data: updateData
    })

    if (assignes) {
      await ctx.prisma.issueToUser.deleteMany({
        where: {
          issueId: id
        }
      })

      await Promise.all(assignes.map(async (userId) => {
        await ctx.prisma.issueToUser.create({
          data: {
            issueId: issue.id,
            userId,
          }
        })
      }))
    }

    return issue
  }),
  getByProject: publicProcedure.input(
    projectSchema
  ).query(async ({ ctx, input }) => {
    const { id, slug, name } = input
    if (!id && !slug && !name) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Provide a project id, slug or name"
      })
    }

    const project = await ctx.prisma.project.findFirst({
      where: {
        slug,
        id,
        name
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

    if (!ctx.session) {
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

    const projectId = project.id
    const doneStatuses = [
      "done",
      "closed",
      "cancelled"
    ]

    const doneIssues: IssueResponse[] = await ctx.prisma.issue.findMany({
      include: {
        assignes: true
      },
      where: {
        projectId,
        status: {
          in: doneStatuses
        }
      },
    })

    const pendingIssues: IssueResponse[] = await ctx.prisma.issue.findMany({
      include: {
        assignes: true
      },
      where: {
        projectId,
        status: {
          notIn: doneStatuses
        }
      }
    })

    return {
      done: doneIssues,
      pending: pendingIssues
    }
  })
});