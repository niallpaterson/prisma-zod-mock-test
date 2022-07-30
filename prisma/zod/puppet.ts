import * as z from "zod"
import * as imports from "../types"
import { CompletePuppetMaster, PuppetMasterModel, CompletePuppetStrings, PuppetStringsModel } from "./index"

export const _PuppetModel = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  masterId: z.number().int(),
  stringId: z.number().int(),
})

export interface CompletePuppet extends z.infer<typeof _PuppetModel> {
  master: CompletePuppetMaster
  strings: CompletePuppetStrings
}

/**
 * PuppetModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const PuppetModel: z.ZodSchema<CompletePuppet> = z.lazy(() => _PuppetModel.extend({
  master: PuppetMasterModel,
  strings: PuppetStringsModel,
}))
