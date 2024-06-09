import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().nonempty("El nombre del proyecto es requerido"),
  description: z.string().nonempty("La descripción del proyecto es requerida"),
  isPublic: z.boolean().default(false),
})