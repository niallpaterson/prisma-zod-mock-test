import * as z from "zod"
import * as imports from "../types"
import { CompletePuppet, PuppetModel } from "./index"

export const _PuppetMasterModel = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePuppetMaster extends z.infer<typeof _PuppetMasterModel> {
  puppets: CompletePuppet[]
}

/**
 * PuppetMasterModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const PuppetMasterModel: z.ZodSchema<CompletePuppetMaster> = z.lazy(() => _PuppetMasterModel.extend({
  puppets: PuppetModel.array(),
}))
