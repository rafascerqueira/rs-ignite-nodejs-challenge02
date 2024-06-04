import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ApiError } from '../../../errors/ApiError'
import { EditMealUseCase } from '../useCases/EditMealUseCase'

export class EditMealController {
  async execute(request: FastifyRequest, reply: FastifyReply) {
    const EditMealSchema = z.object({
      name: z.optional(z.string()),
      description: z.optional(z.string()),
      is_on_diet: z.optional(z.boolean()),
      date: z.optional(z.coerce.date()),
    })

    const idSchema = z.object({
      id: z.string().uuid(),
    })

    const { name, description, is_on_diet, date } = EditMealSchema.parse(
      request.body,
    )

    const { id } = idSchema.parse(request.params)

    const payload = { name, description, is_on_diet, date }

    const editMealUseCase = new EditMealUseCase()

    await editMealUseCase.execute(id, payload)

    return reply.send()
  }
}
