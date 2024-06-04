import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ShowAllMealsByUserUseCase } from '../useCases/ShowAllMealsByUserUseCase'
import { ApiError } from '../../../errors/ApiError'

export class ShowAllMealsByUserController {
  async execute(request: FastifyRequest, reply: FastifyReply) {
    const userSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = userSchema.parse(request.user)

    if (!id) {
      throw new ApiError('User as not found!')
    }

    const showAllMealsByUserUseCase = new ShowAllMealsByUserUseCase()

    const meals = await showAllMealsByUserUseCase.execute(id)

    return reply.send({ meals })
  }
}
