import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().nonempty("The name of the project is required"),
  description: z.string().nonempty("The description of the project is required"),
  isPublic: z.boolean().default(false),
})

export const EditProjectSchema = z.object({
  id: z.string().nonempty("The id of the project is required"),
}).merge(CreateProjectSchema).partial()