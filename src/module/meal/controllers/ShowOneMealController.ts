import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ShowOneMealUseCase } from '../useCases/ShowOneMealUseCase'

export class ShowOneMealController {
  async execute(request: FastifyRequest, reply: FastifyReply) {
    const mealSchema = z.object({
      id: z.string().uuid(),
    })

    const userSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = mealSchema.parse(request.params)

    const user = userSchema.parse(request.user)

    const showOneMealUseCase = new ShowOneMealUseCase()

    const meal = await showOneMealUseCase.execute(id, user.id)

    return reply.send(meal)
  }
}
