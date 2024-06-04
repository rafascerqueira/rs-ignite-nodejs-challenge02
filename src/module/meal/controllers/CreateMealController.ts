import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CreateMealUseCase } from '../useCases/CreateMealUseCase'
import { ApiError } from '../../../errors/ApiError'

export class CreateMealController {
  async execute(request: FastifyRequest, reply: FastifyReply) {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
      userId: z.string(),
    })

    const { name, description, isOnDiet, date, userId } =
      createMealSchema.parse(request.body)

    if (!userId) {
      throw new ApiError("This 'user' does not exist")
    }

    const createMealUseCase = new CreateMealUseCase()

    const [id] = await createMealUseCase.execute({
      name,
      description,
      isOnDiet,
      date,
      userId,
    })

    return reply.status(201).send(id)
  }
}
