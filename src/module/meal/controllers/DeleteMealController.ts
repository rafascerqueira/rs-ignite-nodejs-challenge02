import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { DeleteMealUseCase } from '../useCases/DeleteMealUseCase'

export class DeleteMealController {
  async execute(request: FastifyRequest, reply: FastifyReply) {
    const mealSchema = z.object({
      id: z.string().uuid(),
    })

    const userSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = mealSchema.parse(request.params)

    const user = userSchema.parse(request.user)

    const deleteMealUseCase = new DeleteMealUseCase()

    await deleteMealUseCase.execute(id, user.id)

    return reply.send()
  }
}
