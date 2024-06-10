import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { type Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server";

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

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      isPublic: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const project = await ctx.prisma.project.findFirst({
        include: {
          users: true
        },
        where: {
          id: input.id,
          users: {
            some: {
              userId: user.id,
            }
          }
        }
      })

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found"
        })
      }

      if (project.users.find((u) => u.isEditor && u.userId === user.id) === undefined) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You don't have permission to edit this project"
        })
      }

      return ctx.prisma.project.update({
        where: {
          id: input.id
        },
        data: {
          name: input.name,
          description: input.description,
          isPublic: input.isPublic
        }
      })
    }),

  getByUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const where: Prisma.ProjectWhereInput = {}
      // This function will return the number of pending issues for a project
      const getPendingIssues = async (projectId: string) => {
        return await ctx.prisma.issue.count({
          where: {
            projectId,
            status: {
              notIn: ["closed", "canceled", "done"]
            }
          },
        })
      }

      // If the user is the same as the request user, return all projects
      if (ctx.session.user.id === input.userId) {
        where.users = {
          some: {
            userId: input.userId
          }
        }
      } else {
        where.OR = [
          { // the project is public
            isPublic: true,
            users: {
              some: {
                userId: input.userId,
              }
            }
          },
          {
            users: { // the request user is part of the project
              some: {
                userId: ctx.session.user.id,
              }
            }
          }
        ]
      }

      const projects = await ctx.prisma.project.findMany({ where })
      const formattedProjects = await Promise.all(projects.map(async (project) => {
        const pendingIssues = await getPendingIssues(project.id)
        const lastIssue = await ctx.prisma.issue.findFirst({
          where: {
            projectId: project.id,
          },
          orderBy: {
            updatedAt: "desc"
          }
        })

        // last activity is the last issue update or projeect updatedAt whenever is newer
        let lastActivity: Date = project.updatedAt
        if (lastIssue && lastIssue.updatedAt) {
          lastActivity = lastIssue.updatedAt as Date
        }

        return {
          ...project,
          lastActivity,
          pendingIssues
        }
      }))

      return formattedProjects.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
    })
});
