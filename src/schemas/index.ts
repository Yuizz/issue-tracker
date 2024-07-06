import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().nonempty("The name of the project is required"),
  description: z.string().nonempty("The description of the project is required"),
  isPublic: z.boolean().default(false),
})

export const EditProjectSchema = z.object({
  id: z.string().nonempty("The id of the project is required"),
}).merge(CreateProjectSchema).partial()

export const CreateIssueSchema = z.object({
  name: z.string().nonempty("The name of the issue is required"),
  description: z.string().nonempty("The description of the issue is required"),
  dueDate: z.string().transform((val) => {
    if (val === "") return undefined
    return new Date(val).toISOString()
  }).optional(),
  status: z.enum(["todo", "done", "cancelled", "inProgress"]).default("todo"),
  assignes: z.array(z.string()).optional(),

  projectId: z.string().nonempty("The project id is required"),
})

export const UpdateIssueSchema = z.object({
  id: z.string().nonempty("The id of the issue is required"),
}).merge(CreateIssueSchema).partial().omit({ projectId: true })