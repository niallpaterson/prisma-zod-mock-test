import * as z from "zod"
import * as imports from "../types"
import { CompletePuppet, PuppetModel } from "./index"

export const _PuppetStringsModel = z.object({
  id: z.number().int(),
  count: z.number().int(),
  material: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePuppetStrings extends z.infer<typeof _PuppetStringsModel> {
  puppets: CompletePuppet[]
}

/**
 * PuppetStringsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const PuppetStringsModel: z.ZodSchema<CompletePuppetStrings> = z.lazy(() => _PuppetStringsModel.extend({
  puppets: PuppetModel.array(),
}))
